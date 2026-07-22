+++
title = "not so useful k8s tricks - maybe"
authors = ["Douglas"]
date = 2022-11-04
[taxonomies]

[extra]
+++

Nowadays, I barely touch in helm charts in my job. In the past, I was used to writing a little bit of helm charts performing migrations of deployments that were outdated, and migrating our CI/CD pipelines from drone.io to argo workflows.

I tried my best to prioritize maintainability and code flexibility over complexity in helm chart code deployments.

So below you'll find some examples of useful snippets that simplified my day to day tasks, and other k8s useful stuffs - maybe.

## ⎈ Simplified multi-Ingress

```jsx title="Multi-ingress file" showLineNumbers
{{- $svcPort := .Values.service.port -}}
{{- if .Values.ingresses.enabled -}}
{{- range .Values.ingresses.ingress }}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .name }}
  namespace: {{ .namespace }}
  labels:
{{ include "app.labels" $ | indent 4 }}
  {{- with .annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
{{- if .tls }}
  tls:
  {{- range .tls }}
    - hosts:
    {{- range .hosts }}
      - {{ . | quote }}
    {{- end }}
      secretName: {{ .secretName }}
  {{- end }}
{{- end }}
  rules:
{{- range .rules }}
    - host: {{ .hosts | quote }}
      http:
      {{- range .http.paths }}
        paths:
          - path: {{ .path | quote }}
            pathType: {{ .pathType | quote }}
            backend:
              service:
                name: {{ .backend.service.name | quote }}
                port:
                  number: {{ .backend.service.port.number | default $svcPort }}
      {{- end }}
{{- end }}
{{- end }}
{{- end }}
```

It's modular enough so you can attach and remove ingresses as needed without much hurdle.

Here follows the `value.yaml` example.

It can have a vast number of ingresses each one starting at "name":

```yaml
ingresses:
enabled: true
ingress:
    - name: ingress-1
    namespace: namespace
    annotations:
    ...
    tls:
        - hosts: my.host.com
        secretName: tls-my-host.com
    rules:
        - hosts: my.host.com
        http:
            paths:
            - path: /
            pathType: Prefix
            backend:
                service:
                name: "service-name"
                port:
                    number: 80
    - name: ingress-2
```

This works for any object as well - like Services, Secrets etc; -, and could save you face when you need to plan for a modularized model to be used for multiple apps with as single config.

---

## ⎈ Pod Recurrent Restarts

_Ever wondered how to cycle your deployment/pods the native way? Think no more!_

```jsx title="Roles and account creation" showLineNumbers
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deployment-restart
  namespace: ns-name
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-restart
  namespace: ns-name
rules:
  - apiGroups: ["apps", "extensions"]
    resources: ["deployments"]
    resourceNames: ["deployment-name"]
    verbs: ["get", "patch", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployment-restart
  namespace: ns-name
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployment-restart
subjects:
  - kind: ServiceAccount
    name: deployment-restart
    namespace: ns-name
EOF
```

```jsx title="Cronjob creation" showLineNumbers
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: deployment-restart
  namespace: ns-name
spec:
  schedule: "* */5 * * *"
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 600
      template:
        spec:
          serviceAccountName: deployment-restart
          containers:
            - command:
                - bash
                - -c
                - >-
                  kubectl rollout restart deployment/deployment-name && kubectl rollout status deployment/deployment-name
              image: bitnami/kubectl
              imagePullPolicy: IfNotPresent
              name: kubectl
          restartPolicy: Never
EOF
```

Adjust the values to meet your current needs.

---

## ⎈ Using sealed-secrets the easy way

If your deployment implements the usage of [sealed-secrets](https://github.com/bitnami-labs/sealed-secrets), chances high that someday you'll need to implement a secret by hand.It is the best way to keep your sensitive data safe in a GitOps workflow.

Here is a breakdown that simplifies this process using `kubeseal`.

First, ensure you have the following installed and configured:

- **kubectl**: Connected to your target cluster.
- **kubeseal**: The CLI tool for Sealed Secrets.
- **view-secret**: A kubectl kubecrew plugin (or use standard base64 decoding if you don't have it). To install, run `kubectl krew install view-secret`.

### 1. Fetch the Public Certificate

To encrypt data without needing direct access to the Sealed Secrets controller, you first need to grab the public certificate from your cluster.

#### Find the latest key name:

```bash
kubectl get secret -n kube-system | grep sealed-secrets-key
```

#### Export the certificate:

Replace `{{latest-key-name}}` with the name you found in the previous step.

```bash
kubectl view-secret {{latest-key-name}} -n kube-system tls.crt > tls.crt
```

> **Note:** This `tls.crt` file is public. You can safely share it with your team; it can only be used to **encrypt** data, not decrypt it.

### 2. Encrypt Your Data

You can now generate the encrypted string (the "Sealed" version) to put into your `values.yaml` or Kubernetes manifests.

#### For simple strings:

Use this for passwords, API keys, or tokens.

```bash
echo -n 'your-sensitive-data' | kubeseal --raw \
--scope cluster-wide \
--cert tls.crt \
--controller-name {{latest-key-name}} \
--from-file=/dev/stdin
```

#### For Service Account JSON files:

If you have a Google Cloud or Azure service account file (`SA.json`), use this method:

```bash
cat SA.json | kubeseal --raw \
--scope cluster-wide \
--cert tls.crt \
--controller-name {{latest-key-name}} \
--from-file=/dev/stdin
```

### 💡 Key Parameters Explained

| Parameter                | Purpose                                                               |
| :----------------------- | :-------------------------------------------------------------------- |
| `--raw`                  | Outputs only the encrypted string instead of a full YAML object.      |
| `--scope cluster-wide`   | Allows the secret to be unsealed in any namespace within the cluster. |
| `--cert tls.crt`         | Uses the certificate you just downloaded to perform the encryption.   |
| `--from-file=/dev/stdin` | Tells the tool to read the data you piped in via `echo` or `cat`.     |

### ⚠️ A Quick Pro-Tip

Once you have generated the encrypted string and pasted it into your `values.yaml`, **delete the local `tls.crt` and any plain-text files** (like `SA.json`) if they are no longer needed. Never commit the plain-text versions to your repository!

---

## ⎈ Start a cronjob

Learn how to start a previously deployed cronjob in your cluster:

```bash
kubectl create job --from=cronjob/<cronjob-name> <job-name> -n <namespace-name>
```

---

## ⎈ List API versions

This is how to list all your cluster's API versions for any object:

```bash
kubectl get <anything> -A -o=custom-columns=NAME:.metadata.name,API-Version:.apiVersion
```

---

## ⎈ Multi-Container pods

Pods can run more than one container (like a main app and a "sidecar"). These commands help you target the right one.

### 1. List all containers in a Pod

If you aren't sure what the containers inside a Pod are named, use this command to list them:

```bash
kubectl get pod <podName> -o jsonpath='{.spec.containers[*].name}'
```

### 2. View logs for a specific container

By default, `kubectl logs` might fail if there is more than one container. Use the `-c` flag to specify which one you want to see:

```bash
kubectl logs pod/<podName> -c <containerName>
```

### 3. Access the container's terminal (shell)

If you need to jump inside the container to check file paths, environment variables, or network connectivity:

```bash
kubectl exec -it <podName> -c <containerName> -- /bin/bash
```

- **What it does:** \* `-it`: Interactive and TTY (keeps the session open so you can type).
  - `-c <containerName>`: Ensures you enter the correct container.
  - `-- /bin/bash`: Executes the bash shell (if bash isn't available, try `/bin/sh`).

### 💡 Quick Summary Table

| Goal         | Command Flag        | Why use it?                                            |
| :----------- | :------------------ | :----------------------------------------------------- |
| **Identify** | `-o jsonpath='...'` | When you don't know the container names.               |
| **Debug**    | `logs`              | To see error messages or application output.           |
| **Inspect**  | `exec -it`          | To run manual commands inside the running environment. |

> **Warning:** Be careful with `exec` in production environments! Changes made manually inside a container are **temporary** and will disappear if the Pod restarts. Always update your configuration or Dockerfile for permanent changes.

---

## ⎈ Identify which images are running in a Kubernetes cluster

```bash
kubectl get pods --all-namespaces -o jsonpath="{..image}" |
tr -s '[[:space:]]' 'n' |
sort |
uniq -c
```

---

## ⎈ List all Container images in all namespaces

Easy ti grab a full list of running container images in the cluster, without relying on any extra plugins.

```bash
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

If you want to list all container images by pod, the command is:

```bash
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

---

## ⎈ List all pulled images in worker nodes

List all images pulled for all nodes:

```bash
kubectl get node  -o json | jq -r '.items[].status.images[].names'
```

For a single worker node:

```bash
kubectl get node worker-node -o json | jq -r '.status.images[].names'
```

---

## ⎈ Get and sort cluster events

List all cluster events sorted by the newest first:

```bash
kubectl get events --sort-by='.lastTimestamp'
```

---

## ⎈ Real-time node status monitoring

Filter and monitor nodes in real-time:

```bash
watch -n1 "kubectl get nodes --sort-by=.metadata.creationTimestamp | grep <node_name_hint>"
```

### 💡 Key Parameters Explained

| Parameter                               | Purpose                                    |
| :-------------------------------------- | :----------------------------------------- |
| `-n1`                                   | Runs the following command every 1 second. |
| `--sort-by=.metadata.creationTimestamp` | It sorts the nodes by their age.           |

---

## ⎈ Database health-check probes

When running databases like MySQL in Kubernetes, you want to know if the database is actually responding to queries.

These configurations use **Probes** to automate health checks.

### Database Health Probes (MySQL)

Probes allow Kubernetes to automatically "heal" your application or stop traffic if the database becomes unresponsive.

#### 1. Liveness Probe: "Is the process alive?"

This probe determines if the container needs a **restart**.

```yaml
livenessProbe:
  exec:
    command:
      [
        "bash",
        "-c",
        "mysqladmin --user=$MYSQL_USER --password=$MYSQL_PASSWORD ping",
      ]
  initialDelaySeconds: 30
  timeoutSeconds: 5
```

- **The Check:** Uses `mysqladmin ping` to see if the MySQL server process is alive.
- **Wait Time:** It waits **30 seconds** (`initialDelaySeconds`) after starting before checking. This gives the database enough time to finish its internal startup (buffer pools, log recovery, etc.).
- **Failure:** If the command fails or takes longer than **5 seconds**, Kubernetes will kill the Pod and start a fresh one.

#### 2. Readiness Probe: "Is the DB ready for traffic?"

This probe determines if the container is ready to **accept connections**.

```yaml
readinessProbe:
  exec:
    command:
      [
        "bash",
        "-c",
        "mysql --host=127.0.0.1 --user=$MYSQL_USER --password=$MYSQL_PASSWORD -e 'SELECT 1'",
      ]
  initialDelaySeconds: 5
  periodSeconds: 2
```

- **The Check:** Runs a real SQL query (`SELECT 1`). This is more thorough than a "ping" because it confirms the database can actually execute commands.
- **Frequency:** It checks every **2 seconds** (`periodSeconds`).
- **Traffic Control:** If this fails, Kubernetes removes the Pod from the Service endpoint. Your app won't try to send data to a database that isn't ready.

### 💡 Pro-Tip

Always use a **Readiness Probe** for databases. If your database is doing a heavy internal migration or recovery, you want the Pod to stay "Running" (so it doesn't get killed by a Liveness probe) but you don't want your application to try and connect to it until the migration is finished.

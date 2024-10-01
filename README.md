# Instrukt Demo

## Create/Build a Pepr Module

### Step 1: Create a new Pepr Module

```bash
npx pepr@latest init --name=cluster-controller --description="Control Apps and Global Cluster Security Posture" --errorBehavior="reject" --skip-post-init
```

### Step 2: Write Security Validations

```ts
import {
  Capability,
  a,
  sdk
} from "pepr";

// Containers help to retrieve the containers from a pod
const { containers } = sdk;

export const Controller = new Capability({
  name: "cluster-controller",
  description: "Control Apps and Global Cluster Security Posture.",
});


const { When } = Controller;

// Validate Pods are not running with privileged security context
When(a.Pod)
  .IsCreatedOrUpdated()
  .Validate(po => {
    const podContainers = containers(po);

    for (const container of podContainers) {
      if (container.securityContext?.privileged) {
        return po.Deny("Pods cannot run with privileged security context");
      }
    }
    return po.Approve();
  });
```

### Step 3: Sane Defaults for cluster resources

```ts
// Assign sane defaults for pods
When(a.Pod)
  .IsCreatedOrUpdated()
  .Mutate(po => {
    const podContainers = containers(po);

    for (const container of podContainers) {
      if (
        !container.resources ||
        (!container.resources.requests && !container.resources.limits)
      ) {
        container.resources = {
          requests: {
            cpu: "100m",
            memory: "128Mi",
          },
          limits: {
            cpu: "500m",
            memory: "512Mi",
          },
        };
      }
    }
  });
```

### Step 4: Write a controller for webapps 

Generate the type bindings for the WebApp CRD and create the CRD in the cluster

```bash
# Done in the background
kubectl apply -f https://gist.githubusercontent.com/cmwylie19/69b765af5ab25af62696f3337df13687/raw/72f53db7ddc06fc8891dc81136a7c190bc70f41b/WebApp.yaml 

# They do this
npx pepr@latest kfc crd https://gist.githubusercontent.com/cmwylie19/69b765af5ab25af62696f3337df13687/raw/72f53db7ddc06fc8891dc81136a7c190bc70f41b/WebApp.yaml capabilities
```

Add Logic to handle the WebApp CR
```ts
// Add this to the imports
import { WebApp } from "./webapp-v1alpha1";
import Deploy from "./deployer";

When(WebApp)
.IsCreatedOrUpdated()
.Reconcile(async webapp => {
    await Deploy(webapp);
})
```


### Step 5: Build the module

```bash
npx pepr build
```

## Deploy a Pepr Module

### Step 1: Deploy the Pepr Module

```bash
kubectl apply -f dist/pepr-module*.yaml
```

### Step 2: A Pod Running as Privileged

```bash
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: privileged
  name: privileged
spec:
  containers:
  - image: nginx
    name: privileged
    resources: {}
    securityContext:
      privileged: true
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
EOF
```

### Step 3: A Pod Running without resources defined

```bash
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: no-resources
  name: no-resources
spec:
  containers:
  - image: nginx
    name: no-resources
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
EOF
```

Look at the resources:

```bash
k get po no-resources -ojsonpath='{.spec.containers[0].resources}' | jq
```     

### Step 4: Deploy a WebApp

```bash
kubectl create ns webapps;
kubectl apply -f -<<EOF
kind: WebApp
apiVersion: pepr.io/v1alpha1
metadata:
  name: webapp-light-en
  namespace: webapps
spec:
  theme: light 
  language: en
  replicas: 1 
EOF
```

Look at the WebApp

```bash
kubectl port-forward svc/webapp-light-en 8080:80 -n webapps
```

### Step 5: Update the WebApp

```bash
kubectl apply -f -<<EOF
kind: WebApp
apiVersion: pepr.io/v1alpha1
metadata:
  name: webapp-light-en
  namespace: webapps
spec:
  theme: dark 
  language: en
  replicas: 1 
EOF
```

### Step 6: Delete the WebApp

```bash
kubectl delete webapp webapp-light-en -n webapps
```

look at the pods in the webapps namespace

```bash
kubectl get all -n webapps
```

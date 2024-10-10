import { Capability, a, sdk } from "pepr";
import { WebApp } from "./webapp-v1alpha1";
import Deploy from "./deployer";

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

// Assign sane defaults for pods
When(a.Pod)
  .IsCreatedOrUpdated()
  .Mutate(po => {
    const podContainers = containers(po);

    for (const [index, container] of podContainers.entries()) {
      if (
        !container.resources ||
        (!container.resources.requests && !container.resources.limits)
      ) {
        po.Raw.spec.containers[index].resources = {
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

When(WebApp)
  .IsCreatedOrUpdated()
  .Reconcile(async webapp => {
    await Deploy(webapp);
  });

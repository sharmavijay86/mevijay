---
layout: post
title: "Life After NGINX Ingress: Standing Up Gateway API for Microservices"
description: "With the NGINX Ingress Controller retired, here is how I migrate Kubernetes edge routing to Gateway API and expose both frontend and API workloads safely."
category: "Cloud Native"
tags:
  - Kubernetes
  - Gateway API
  - Networking
read_time: 9
featured_image:
  url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80"
  small_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=70"
  alt: "Network patch cables close-up"
  credit: "Photo by Markus Spiske on Unsplash"
---

Kubernetes users had years of muscle memory around the NGINX Ingress Controller. Now that the project has reached end-of-life, the CNCF Gateway API has become the strategic path forward. Gateway API is not just a drop-in replacement; it gives us first-class APIs for shared gateways, cross-team policy, and vendor portability.

This post covers:

- What the retirement of NGINX Ingress support means for clusters you run today
- Why Gateway API is a safer long-term abstraction for L7 traffic
- A step-by-step manifest to expose both a React/Next.js frontend and a Go/Node API via custom domains

## Why the change?

1. **Project lifecycle**: The community-maintained `kubernetes/ingress-nginx` controller is in maintenance-only mode. Security fixes and new Kubernetes features will lag behind.
2. **API ergonomics**: Ingress resources tried to cover every proxy. Gateway API gives us discrete resources (`GatewayClass`, `Gateway`, `HTTPRoute`, `GRPCRoute`, etc.) and native conformance tests.
3. **Multi-tenancy**: Platform teams can standardize gateway ownership while still delegating routes to app squads without granting cluster-admin rights.

## Migration approach I recommend

1. **Inventory current ingress objects** and group them by hostname/cert.
2. **Deploy a conformant Gateway implementation** (Envoy Gateway, Kong, Traefik, GKE Gateway, AWS ALB Controller, etc.).
3. **Translate ingress rules** into `HTTPRoute` CRDs. Most YAML is reusable; just split host/path matches.
4. **Bake it into GitOps** and include policy guardrails (rate limiting, auth) as separate `PolicyAttachment` resources once you need them.

## Example: Frontend + API domains

Assume you have:

- `frontend` deployment serving a React SPA on port 3000
- `api` deployment exposing a REST API on port 8080
- DNS names `app.example.com` and `api.example.com`

Below is a ready-to-apply manifest. Replace placeholders with your certificates and images.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: envoy-prod
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: edge-shared
  namespace: gateway-system
spec:
  gatewayClassName: envoy-prod
  listeners:
    - name: https-frontend
      protocol: HTTPS
      port: 443
      hostname: app.example.com
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: app-example-com-cert
    - name: https-api
      protocol: HTTPS
      port: 443
      hostname: api.example.com
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: api-example-com-cert
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/org/frontend:stable
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: app
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/org/api:v2
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: app
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: frontend-route
  namespace: app
spec:
  parentRefs:
    - name: edge-shared
      namespace: gateway-system
      sectionName: https-frontend
  hostnames:
    - app.example.com
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: frontend
          port: 80
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
  namespace: app
spec:
  parentRefs:
    - name: edge-shared
      namespace: gateway-system
      sectionName: https-api
  hostnames:
    - api.example.com
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: api
          port: 80
```

### Bootstrapping tips

1. **Install Gateway API CRDs**: `kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.1.0" | kubectl apply -f -`
2. **Deploy your controller** (Envoy Gateway example): `helm repo add envoy-gateway https://envoyproxy.github.io/gateway && helm install envoy-gw envoy-gateway/envoy-gateway -n gateway-system --create-namespace`
3. **Apply the manifest above** and check status: `kubectl get gateway,httproute -A`
4. **Update DNS** records to point `app.example.com` and `api.example.com` at the load balancer IP/hostname created by your Gateway implementation.

### Operational guardrails

- **Certificates**: Use cert-manager or your cloud TLS product to keep listener secrets renewed.
- **Policies**: Attach `HTTPRouteFilter` entries for rate limiting, JWT auth, or header rewrites without editing each route.
- **Observability**: Gateway API standardizes status conditions—watch `status.conditions` for `Programmed` and `Accepted` to confirm propagation.
- **Rollbacks**: Keep the old NGINX controller around until every HTTPRoute is tested; you can run both gateways side-by-side during migration.

## Final thoughts

Gateway API is not just a replacement task on your backlog; it's an opportunity to adopt a standards-based data plane that improves platform UX. The sooner you codify your ingress patterns with Gateway API resources, the sooner you can retire brittle, controller-specific annotations and gain consistent routing, policy, and status across clusters.

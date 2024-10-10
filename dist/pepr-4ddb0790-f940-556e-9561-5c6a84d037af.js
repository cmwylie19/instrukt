var v=Object.defineProperty;var a=(e,t)=>v(e,"name",{value:t,configurable:!0});var h=require("pepr");var u={name:"cluster-controller",version:"0.0.1",description:"Control Apps and Global Cluster Security Posture",keywords:["pepr","k8s","policy-engine","pepr-module","security"],engines:{node:">=18.0.0"},pepr:{uuid:"4ddb0790-f940-556e-9561-5c6a84d037af",onError:"reject",webhookTimeout:10,customLabels:{namespace:{"pepr.dev":""}},alwaysIgnore:{namespaces:[]},includedFiles:[],env:{}},scripts:{"k3d-setup":"k3d cluster delete pepr-dev && k3d cluster create pepr-dev --k3s-arg '--debug@server:0' --wait && kubectl rollout status deployment -n kube-system"},dependencies:{pepr:"0.37.1",nock:"13.5.4"},devDependencies:{typescript:"5.3.3"}};var i=require("pepr");var p=require("kubernetes-fluent-client");var s=class extends p.GenericKind{static{a(this,"WebApp")}spec;status};(0,p.RegisterKind)(s,{group:"pepr.io",version:"v1alpha1",kind:"WebApp",plural:"webapps"});var n=require("pepr");var{getOwnerRefFrom:c}=n.sdk;async function l(e){try{await Promise.all([(0,n.K8s)(n.kind.Deployment).Apply(x(e),{force:!0}),(0,n.K8s)(n.kind.Service).Apply(k(e),{force:!0}),(0,n.K8s)(n.kind.ConfigMap).Apply(w(e),{force:!0})])}catch(t){n.Log.error(t,"Failed to apply Kubernetes manifests.")}}a(l,"Deploy");function x(e){let{name:t,namespace:o}=e.metadata,{replicas:r}=e.spec;return{apiVersion:"apps/v1",kind:"Deployment",metadata:{ownerReferences:c(e),name:t,namespace:o,labels:{"pepr.dev/operator":t}},spec:{replicas:r,selector:{matchLabels:{"pepr.dev/operator":t}},template:{metadata:{ownerReferences:c(e),annotations:{buildTimestamp:`${Date.now()}`},labels:{"pepr.dev/operator":t}},spec:{containers:[{name:"server",image:"nginx:1.19.6-alpine",ports:[{containerPort:80}],volumeMounts:[{name:"web-content-volume",mountPath:"/usr/share/nginx/html"}]}],volumes:[{name:"web-content-volume",configMap:{name:`web-content-${t}`}}]}}}}}a(x,"deployment");function k(e){let{name:t,namespace:o}=e.metadata;return{apiVersion:"v1",kind:"Service",metadata:{ownerReferences:c(e),name:t,namespace:o,labels:{"pepr.dev/operator":t}},spec:{selector:{"pepr.dev/operator":t},ports:[{protocol:"TCP",port:80,targetPort:80}],type:"ClusterIP"}}}a(k,"service");function w(e){let{name:t,namespace:o}=e.metadata,{language:r,theme:b}=e.spec,f=`
        <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Pepr</title>
        <style>
        ${b==="light"?`
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #fff;
            color: #333;
            text-align: center;
        }
        .top-panel {
            background: #fbfbfb;
            color: #333;
            padding: 10px 0;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .top-panel img {
            height: 60px;
            vertical-align: middle;
            margin-right: 15px;
        }
        .top-panel h1 {
            display: inline;
            vertical-align: middle;
            font-size: 24px;
        }
        .container {
            max-width: 900px;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 80px; /* Added margin-top to avoid overlap with the fixed top panel */
        }
        h2 {
            color: #b22222;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
            text-align: left;
            color: #333;
        }
        .section {
            margin-bottom: 20px;
        }
        .links {
            margin-top: 20px;
        }
        .links a {
            display: inline-block;
            margin-right: 15px;
            color: #006bee;
            text-decoration: none;
            font-weight: bold;
        }
        `:`
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #1a1a1a;
            color: #f5f5f5;
            text-align: center;
        }
        .top-panel {
            background: #333;
            color: #fff;
            padding: 10px 0;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .top-panel img {
            height: 60px;
            vertical-align: middle;
            margin-right: 15px;
        }
        .top-panel h1 {
            display: inline;
            vertical-align: middle;
            font-size: 24px;
        }
        .container {
            max-width: 900px;
            background: #222;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            margin-top: 80px; /* Added margin-top to avoid overlap with the fixed top panel */
        }
        h2 {
            color: #b22222;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
            text-align: left;
            color: #f5f5f5;
        }
        .section {
            margin-bottom: 20px;
        }
        .links {
            margin-top: 20px;
        }
        .links a {
            display: inline-block;
            margin-right: 15px;
            color: #006bee;
            text-decoration: none;
            font-weight: bold;
        }
        `}
        </style>
    </head>
    <body>
        ${r==="en"?`
        <div class="top-panel">
        <img src="https://raw.githubusercontent.com/defenseunicorns/pepr/main/_images/pepr.png" alt="Pepr Logo">
        <h1>Pepr - Kubernetes Controller</h1>
        <img src="https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.png" alt="Kubernetes Logo">
    </div>
    <div class="container">
        <div class="section">
            <h2>About the Project</h2>
            <p>Our Kubernetes Admission Controller and Operator are designed to ensure security, efficiency, and reliability in your container orchestration. The Admission Controller provides rigorous security checks and governance, while the Operator simplifies complex operations, making management a breeze.</p>
        </div>
        <div class="section">
            <h2>Features</h2>
            <p><strong>Admission Controller:</strong> Automated compliance checks, real-time security enforcement, and seamless integration with your CI/CD pipeline.</p>
            <p><strong>Operator:</strong> Automate your Kubernetes applications, streamline deployment processes, and enable self-healing capabilities with our sophisticated Operator.</p>
        </div>
        <div class="section">
            <h2>Get Involved</h2>
            <p>Join our community and start contributing today. Find us on GitHub and join our Slack channel to connect with other users and contributors.</p>
            <div class="links">
                <a href="https://github.com/defenseunicorns/pepr" target="_blank">GitHub Repository</a>
                <a href="https://kubernetes.slack.com/archives/C06DGH40UCB" target="_blank">Slack Channel</a>
            </div>
        </div>
    </div>
        `:`
        <div class="top-panel">
        <img src="https://raw.githubusercontent.com/defenseunicorns/pepr/main/_images/pepr.png" alt="Pepr Logo">
        <h1>Pepr - Controlador De Kubernetes</h1>
        <img src="https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.png" alt="Kubernetes Logo">
    </div>
    <div class="container">
        <div class="section">
            <h2>Sobre el proyecto</h2>
            <p>Nuestro controlador est\xE1 dise\xF1ado para garantizar la seguridad, la eficiencia y la confiabilidad en la orquestaci\xF3n de tus contenedores. El Controlador de Admisi\xF3n proporciona control y controles de seguridad rigurosos, mientras que el Operador simplifica operaciones complejas, haciendo que la administraci\xF3n sea muy sencilla.</p>
        </div>
        <div class="section">
            <h2>Caracter\xEDsticas</h2>
            <p><strong>Controlador de Admisi\xF3n :</strong>
            Verificaciones de cumplimiento automatizadas, aplicaci\xF3n de seguridad en tiempo real y integraci\xF3n perfecta con su canal de CI/CD.</p>
            <p><strong>Operador:</strong>Automatice tus aplicaciones de Kubernetes, optimice los procesos de implementaci\xF3n y habilite capacidades de autorreparaci\xF3n con nuestro sofisticado Operador.</p>
        </div>
        <div class="section">
            <h2>Hablanos!</h2>
            <p>\xDAnate a nuestra comunidad y comience a contribuir hoy. Encu\xE9ntrenos en GitHub y \xFAnate a nuestro canal de Slack para conectarte con otros usuarios y contribuyentes.</p>
            <div class="links">
                <a href="https://github.com/defenseunicorns/pepr" target="_blank">GitHub Repository</a>
                <a href="https://kubernetes.slack.com/archives/C06DGH40UCB" target="_blank">Slack Channel</a>
            </div>
        </div>
    </div>
        `}
    </body>
    </html>
        `;return{apiVersion:"v1",kind:"ConfigMap",metadata:{ownerReferences:c(e),name:`web-content-${t}`,namespace:o,labels:{"pepr.dev/operator":t}},data:{"index.html":`${f}`}}}a(w,"configmap");var{containers:g}=i.sdk,d=new i.Capability({name:"cluster-controller",description:"Control Apps and Global Cluster Security Posture."}),{When:m}=d;m(i.a.Pod).IsCreatedOrUpdated().Validate(e=>{let t=g(e);for(let o of t)if(o.securityContext?.privileged)return e.Deny("Pods cannot run with privileged security context");return e.Approve()});m(i.a.Pod).IsCreatedOrUpdated().Mutate(e=>{let t=g(e);for(let[o,r]of t.entries())(!r.resources||!r.resources.requests&&!r.resources.limits)&&(e.Raw.spec.containers[o].resources={requests:{cpu:"100m",memory:"128Mi"},limits:{cpu:"500m",memory:"512Mi"}})});m(s).IsCreatedOrUpdated().Reconcile(async e=>{await l(e)});new h.PeprModule(u,[d]);
//# sourceMappingURL=pepr-4ddb0790-f940-556e-9561-5c6a84d037af.js.map

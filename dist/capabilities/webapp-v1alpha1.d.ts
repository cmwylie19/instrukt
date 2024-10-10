import { GenericKind } from "kubernetes-fluent-client";
export declare class WebApp extends GenericKind {
    apiVersion?: string;
    kind?: string;
    metadata?: {
        [key: string]: any;
    };
    spec?: Spec;
    status?: Status;
}
export interface Spec {
    /**
     * Language defines the language of the web application, either English (en) or Spanish (es).
     */
    language: Language;
    /**
     * Replicas is the number of desired replicas.
     */
    replicas: number;
    /**
     * Theme defines the theme of the web application, either dark or light.
     */
    theme: Theme;
}
/**
 * Language defines the language of the web application, either English (en) or Spanish (es).
 */
export declare enum Language {
    En = "en",
    Es = "es"
}
/**
 * Theme defines the theme of the web application, either dark or light.
 */
export declare enum Theme {
    Dark = "dark",
    Light = "light"
}
export interface Status {
    observedGeneration?: number;
    phase?: Phase;
}
export declare enum Phase {
    Failed = "Failed",
    Pending = "Pending",
    Ready = "Ready"
}
//# sourceMappingURL=webapp-v1alpha1.d.ts.map
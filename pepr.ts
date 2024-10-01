import { PeprModule } from "pepr";
import cfg from "./package.json";

import { Controller } from "./capabilities/controller";

new PeprModule(cfg, [Controller]);

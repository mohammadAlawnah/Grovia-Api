import { SetMetadata } from "@nestjs/common";

import { userType } from "src/utils/enums";

// Roles Method Decorator 
export const Roles = (...roles:userType[]) => SetMetadata('roles',roles)


import { PartialType } from "@nestjs/swagger";
import { BaseGuruDto } from "./base-guru.dto";

export class UpdateGuruDto extends PartialType(BaseGuruDto) {}
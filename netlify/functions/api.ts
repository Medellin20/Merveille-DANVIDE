import serverless from "serverless-http";
import { createApiApp } from "../../server/_core/app";

export const handler = serverless(createApiApp());

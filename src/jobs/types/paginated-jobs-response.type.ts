import { Job } from "../../db/schema";

export type PaginatedJobsResponse = {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
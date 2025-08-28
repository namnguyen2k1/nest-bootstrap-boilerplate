import { PipelineStage } from "mongoose";
import { Role } from "./models/role.model";

export function buildRoleWithPermissionPipeline(
  options: {
    match?: Partial<Role>;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  } = {},
): PipelineStage[] {
  const { match = {}, limit, skip, sort } = options;

  const pipeline: PipelineStage[] = [];

  // Match
  pipeline.push({ $match: match });

  // Lookup role-permissions
  pipeline.push({
    $lookup: {
      from: "role-permissions",
      localField: "_id",
      foreignField: "roleId",
      as: "rolePermissions",
    },
  });
  pipeline.push({
    $unwind: { path: "$rolePermissions", preserveNullAndEmptyArrays: true },
  });

  // Lookup permissions
  pipeline.push({
    $lookup: {
      from: "permissions",
      localField: "rolePermissions.permissionId",
      foreignField: "_id",
      as: "permissionsInfo",
    },
  });
  pipeline.push({
    $unwind: { path: "$permissionsInfo", preserveNullAndEmptyArrays: true },
  });

  // Group
  pipeline.push({
    $group: {
      _id: "$_id",
      key: { $first: "$key" },
      description: { $first: "$description" },
      maxDeviceLogin: { $first: "$maxDeviceLogin" },
      status: { $first: "$status" },
      permissions: { $addToSet: "$permissionsInfo.key" },
    },
  });

  if (sort) pipeline.push({ $sort: sort });
  if (skip !== undefined) pipeline.push({ $skip: skip });
  if (limit !== undefined) pipeline.push({ $limit: limit });

  return pipeline;
}

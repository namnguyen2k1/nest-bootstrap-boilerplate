import { Device, DEVICE_STATUS } from "@models/device.model";
import { Location } from "@models/location.model";
import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "@repositories/device.repository";
import { LocationRepository } from "@repositories/location.repository";
import { formatDate } from "@shared/utils/format-date";
import { toObjectId } from "@shared/utils/to-object-id";
import { FilterQuery } from "mongoose";

@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly locationRepo: LocationRepository,
  ) {}

  get deviceModel() {
    return this.deviceRepo.model;
  }

  async createOrUpdateIfExisted(filter: FilterQuery<Device>, dto: Partial<Device>) {
    return await this.deviceRepo.createOrUpdateIfExisted(filter, dto);
  }

  async createLocationOrUpdateIfExisted(filter: FilterQuery<Location>, dto: Partial<Location>) {
    return await this.locationRepo.createOrUpdateIfExisted(filter, dto);
  }

  async find(filter: FilterQuery<Device>) {
    return await this.deviceRepo.findAll(filter);
  }

  async findOne(filter: FilterQuery<Device>) {
    return await this.deviceRepo.findOne(filter);
  }

  async updateStatus(deviceId: string, status: DEVICE_STATUS) {
    return await this.deviceRepo.updateOne(
      {
        id: deviceId,
      },
      {
        status,
      },
    );
  }

  async deleteByUserId(userId: string) {
    return await this.deviceRepo.model.deleteMany({
      userId,
    });
  }

  async getAllDeviceOfUser(userId: string) {
    const devices = await this.deviceRepo.findAll(
      {
        userId: toObjectId(userId),
        status: DEVICE_STATUS.ACTIVE,
      },
      {
        populate: {
          path: "userId",
          populate: {
            path: "roleId",
          },
        },
      },
    );

    return devices.map((d) => {
      return {
        ...d,
        ...(d.lastLogin && {
          lastLogin: formatDate(d.lastLogin),
        }),
      };
    });
  }
}

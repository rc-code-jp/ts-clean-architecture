import { ITaskGroupRepository } from '@/application/repositries/ITaskGroupRepository';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';
import { db } from '@/lib/database';

export class TaskGroupRepository implements ITaskGroupRepository {
  findAll(userId: number): Promise<TaskGroupModel[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: number, userId: number): Promise<TaskGroupModel | null> {
    const item = await db.taskGroup.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!item) return null;

    const model = new TaskGroupModel({
      id: item.id,
      name: item.name,
    });

    return model;
  }

  save(task: TaskGroupModel): Promise<TaskGroupModel> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<TaskGroupModel> {
    throw new Error('Method not implemented.');
  }
}

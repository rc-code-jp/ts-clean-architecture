import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';
import { TaskModel } from '@/domain/models/TaskModel';
import { db } from '@/infrastructure/database/db';

export class TaskGroupRepository implements ITaskGroupRepository {
  async findAll(params: { userId: number }): Promise<TaskGroupModel[]> {
    const list = await db.taskGroup.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        sort: true,
      },
      where: {
        userId: params.userId,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    const models = list.map(
      (item) =>
        new TaskGroupModel({
          id: item.id,
          userId: item.userId,
          name: item.name,
          sort: item.sort,
        }),
    );
    return models;
  }

  async findOne(params: { id: number; userId: number }): Promise<TaskGroupModel | null> {
    const item = await db.taskGroup.findFirst({
      where: {
        id: params.id,
        userId: params.userId,
      },
    });

    if (!item) return null;

    const tasks = await db.task.findMany({
      where: {
        taskGroupId: item.id,
      },
      orderBy: {
        sort: 'asc',
      },
    });

    const model = new TaskGroupModel({
      id: item.id,
      userId: item.userId,
      name: item.name,
      sort: item.sort,
      tasks: tasks.map(
        (task) =>
          new TaskModel({
            id: task.id,
            taskGroupId: task.taskGroupId,
            title: task.title,
            description: task.description ?? undefined,
            dueDate: task.dueDate ?? undefined,
            dueTime: task.dueTime ?? undefined,
            done: task.done,
            sort: task.sort,
          }),
      ),
    });

    return model;
  }

  async findMaxSort(params: { userId: number }): Promise<number> {
    const item = await db.taskGroup.findFirst({
      select: { sort: true },
      where: { userId: params.userId },
      orderBy: { sort: 'desc' },
    });
    if (!item) {
      return 0;
    }
    return item.sort;
  }

  async save(params: { item: TaskGroupModel }): Promise<TaskGroupModel> {
    const item = params.item;

    if (item.id) {
      await db.taskGroup.update({
        where: { id: item.id },
        data: {
          name: item.name,
          sort: item.sort,
        },
      });
      return item;
    }
    const res = await db.taskGroup.create({
      data: {
        userId: item.userId,
        name: item.name,
        sort: item.sort,
      },
    });
    return new TaskGroupModel({
      id: res.id,
      userId: res.userId,
      name: res.name,
      sort: res.sort,
    });
  }

  async delete(params: { item: TaskGroupModel }): Promise<number> {
    // 外部キー制約のため、先にタスクを削除する
    await db.task.deleteMany({
      where: {
        taskGroupId: params.item.id,
      },
    });

    const item = await db.taskGroup.delete({
      where: {
        id: params.item.id,
      },
    });

    return item.id;
  }
}

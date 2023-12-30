import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { TaskModel } from '@/domain/models/TaskModel';
import { db } from '@/infrastructure/store/database/db';

export class TaskRepository implements ITaskRepository {
  async findOne(params: { id: number; userId: number }): Promise<TaskModel | null> {
    const item = await db.task.findFirst({
      where: { id: params.id, taskGroup: { userId: params.userId } },
    });
    if (!item) return null;

    const model = new TaskModel({
      id: item.id,
      taskGroupId: item.taskGroupId,
      title: item.title,
      description: item.description ?? undefined,
      dueDate: item.dueDate ?? undefined,
      dueTime: item.dueTime ?? undefined,
      done: item.done,
      sort: item.sort,
    });
    return model;
  }

  async save(params: { item: TaskModel }): Promise<TaskModel> {
    const item = params.item;

    if (item.id) {
      await db.task.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description,
          dueDate: item.dueDate,
          dueTime: item.dueTime,
          done: item.done,
          sort: item.sort,
        },
      });
      return item;
    }

    // 新規
    const res = await db.task.create({
      data: {
        title: item.title,
        taskGroupId: item.taskGroupId,
        description: item.description,
        dueDate: item.dueDate,
        dueTime: item.dueTime,
        done: item.done,
        sort: item.sort,
      },
    });
    const newItem = new TaskModel({
      id: res.id,
      taskGroupId: res.taskGroupId,
      title: res.title,
      description: res.description ?? undefined,
      dueDate: res.dueDate ?? undefined,
      dueTime: res.dueTime ?? undefined,
      done: res.done,
      sort: res.sort,
    });
    return newItem;
  }

  async delete(params: { item: TaskModel }): Promise<number> {
    const item = await db.task.delete({
      where: {
        id: params.item.id,
      },
    });

    return item.id;
  }

  async deleteDone(params: { userId: number; taskGroupId?: number }): Promise<number> {
    const res = await db.task.deleteMany({
      where: {
        done: true,
        taskGroup: { userId: params.userId },
        ...(params.taskGroupId ? { taskGroupId: params.taskGroupId } : {}),
      },
    });

    return res.count;
  }
}

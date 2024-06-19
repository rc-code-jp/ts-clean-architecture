import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';

const factory = createFactory();

/**
 * タスクグループを削除する
 */
export const deleteTaskGroup = factory.createHandlers(async (c) => {
  const { taskGroupId } = c.req.param();

  const userId = c.get('userId');

  const taskGroupController = new TaskGroupController();
  const res = await taskGroupController.deleteTaskGroup({
    id: Number(taskGroupId),
    userId,
  });

  return successResponse(
    JSON.stringify({
      id: res,
    }),
  );
});

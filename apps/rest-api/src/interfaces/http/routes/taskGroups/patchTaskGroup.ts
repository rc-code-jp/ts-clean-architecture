import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { successResponse } from '@/interfaces/http/utils/responses';
import { patchValidation } from '@/interfaces/http/validators/taskGroups';
import { createFactory } from 'hono/factory';

const factory = createFactory();

/**
 * タスクグループ更新
 */
export const patchTaskGroup = factory.createHandlers(patchValidation, async (c) => {
  const { taskGroupId } = c.req.param();
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const taskGroupController = new TaskGroupController();
  const res = await taskGroupController.updateTaskGroup({
    id: Number(taskGroupId),
    userId,
    name: body.name,
  });

  return successResponse(
    JSON.stringify({
      id: res,
    }),
  );
});

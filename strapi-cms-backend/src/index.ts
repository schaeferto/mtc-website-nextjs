import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Initialize isDisabled field for all existing trainings
    try {
      const trainings = await strapi.db
        .query("api::training.training")
        .findMany();

      for (const training of trainings) {
        if (training.isDisabled === null || training.isDisabled === undefined) {
          await strapi.db.query("api::training.training").update({
            where: { id: training.id },
            data: { isDisabled: false },
          });
        }
      }

      const updatedCount = trainings.filter(
        (t: any) => t.isDisabled === null || t.isDisabled === undefined,
      ).length;
      if (updatedCount > 0) {
        console.log(
          `✓ Initialized ${updatedCount} trainings with isDisabled = false`,
        );
      }
    } catch (error) {
      console.error(
        "Error initializing isDisabled field for trainings:",
        error,
      );
    }
  },
};

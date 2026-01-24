
export default {
    async beforeCreate(event: any) {
        await updateTitle(event);
    },

    async beforeUpdate(event: any) {
        await updateTitle(event);
    },
};

async function updateTitle(event: any) {
    const { data, where } = event.params;

    // Get date from data or current entry
    let dateStr = data.date;
    let trainingId = data.training;

    // If updating, we might need to fetch missing data
    if (!dateStr || !trainingId) {
        const entryId = where?.documentId || where?.id || data?.id;
        if (entryId) {
            const entry: any = await strapi.entityService.findOne('api::event.event', entryId, {
                populate: ['training'],
            });
            if (entry) {
                dateStr = dateStr || entry.date;
                trainingId = trainingId || (entry.training ? entry.training.id || entry.training.documentId : null);
            }
        }
    }

    if (dateStr && trainingId) {
        const training: any = await strapi.entityService.findOne('api::training.training', trainingId);
        if (training) {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });

            data.title = `${training.title} - ${formattedDate}`;
        }
    }
}

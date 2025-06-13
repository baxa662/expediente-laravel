import peticion from "./GlobalService";

const DietServices = {
    getDiets: async (params) => {
        try {
            const response = await peticion(params, "diets");
            return response;
        } catch (error) {
            console.error("Error fetching diets:", error);
            return { success: false, msg: "Error fetching diets" };
        }
    },

    create: async (data) => {
        try {
            const response = await peticion(data, "diets/create");
            return response;
        } catch (error) {
            console.error("Error creating diet:", error);
            return { success: false, msg: "Error creating diet" };
        }
    },

    update: async (id, data) => {
        try {
            const response = await peticion(data, `diets/update/${id}`);
            return response;
        } catch (error) {
            console.error("Error updating diet:", error);
            return { success: false, msg: "Error updating diet" };
        }
    },

    destroy: async (params) => {
        try {
            const response = await peticion(params, "diets/delete");
            return response;
        } catch (error) {
            console.error("Error deleting diet:", error);
            return { success: false, msg: "Error deleting diet" };
        }
    },

    getDietDetail: async (id) => {
        try {
            const response = await peticion({}, `diets/detail/${id}`, "GET");
            return response;
        } catch (error) {
            console.error("Error fetching diet detail:", error);
            return { success: false, msg: "Error fetching diet detail" };
        }
    },

    addRecipeToDiet: async (dietId, data) => {
        try {
            const response = await peticion(data, `diets/${dietId}/add-recipe`);
            return response;
        } catch (error) {
            console.error("Error adding recipe to diet:", error);
            return { success: false, msg: "Error adding recipe to diet" };
        }
    },

    addIngredientToDiet: async (dietId, data) => {
        try {
            const response = await peticion(
                data,
                `diets/${dietId}/add-ingredient`
            );
            return response;
        } catch (error) {
            console.error("Error adding ingredient to diet:", error);
            return { success: false, msg: "Error adding ingredient to diet" };
        }
    },

    addTimeToDiet: async (dietId, data) => {
        try {
            const response = await peticion(data, `diets/${dietId}/add-time`);
            return response;
        } catch (error) {
            console.error("Error adding time to diet:", error);
            return { success: false, msg: "Error adding time to diet" };
        }
    },

    removeTimeFromDiet: async (dietId, timeId) => {
        try {
            const response = await peticion(
                {},
                `diets/${dietId}/remove-time/${timeId}`,
                "DELETE"
            );
            return response;
        } catch (error) {
            console.error("Error removing time from diet:", error);
            return { success: false, msg: "Error removing time from diet" };
        }
    },

    removeRecipeFromDiet: async (dietId, recipeId) => {
        try {
            const response = await peticion(
                { recipeId },
                `diets/${dietId}/remove-recipe`
            );
            return response;
        } catch (error) {
            console.error("Error removing recipe from diet:", error);
            return { success: false, msg: "Error removing recipe from diet" };
        }
    },

    removeIngredientFromDiet: async (dietId, ingredientId) => {
        try {
            const response = await peticion(
                { ingredientId },
                `diets/${dietId}/remove-ingredient`
            );
            return response;
        } catch (error) {
            console.error("Error removing ingredient from diet:", error);
            return {
                success: false,
                msg: "Error removing ingredient from diet",
            };
        }
    },
};

export default DietServices;

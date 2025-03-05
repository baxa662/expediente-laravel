import { useState } from "react";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";
import { IconButton } from "../../../../components/IconButton";

const IngredientCollapse = ({ingredient, idRecipe}) => {
    const [isEditing, setIsEditing] = useState(false)

    const {amount, measure} = IngredientConvertions.equivalentToAmount(ingredient, ingredient.equivalent);

    const onDeleteIngredient = async (ingredientId) => {
        const params = {
          idRecipe: id,
          idIngredient: ingredientId
        };
        const response = await RecipeServices.deleteRecipeIngredient(params);
        setalertMessage(response.success ? response.msg : response.message ? response.message : 'Ocurrio un error al eliminar el ingrediente');
        setalertType(response.success ? 'success' : 'error');
        setShowAlert(true);
        refreshRecipeDetail();
      };

      const onUpdateIngredient = async (ingredientId) => {
        if (isEditing) {
          const params = {
            idRecipe: idRecipe,
            idIngredient: ingredientId,
            equivalent: newEquivalent
          };
          const response = await RecipeServices.updateRecipeIngredient(params);
          setalertMessage(response.success ? response.msg : response.message ? response.message : 'Ocurrio un error al actualizar el ingrediente');
          setalertType(response.success ? 'success' : 'error');
          setShowAlert(true);
          setEditingIngredientId(null);
          refreshRecipeDetail();
        } else {
         setIsEditing(true);
        }
      };

return   <div key={ingredient.id} className="collapse collapse-plus bg-base-200">
<input type="radio" name="my-accordion-3" />
<div className="collapse-title text-xl font-medium">
  {ingredient.name} - {measure}(s)
</div>
<div className="collapse-content">
  <div className="flex flex-col gap-2">
    <p>Equivalente: {isEditing ? (
      <input 
        type="text" 
        onChange={(e) => setNewEquivalent(e.target.value)} 
        className="input input-bordered"
        defaultValue={ingredient.equivalent}
      />
    ) : (
      ingredient.equivalent
    )}</p>
    <p>Gramos: {amount}</p>
  </div>
  <div className="flex gap-2 mt-2">
    <IconButton
      onclick={() => onUpdateIngredient(ingredient.id)}
      clase={'btn-success'}
      icon={isEditing ? 'save' : null}
    >
      {isEditing ? (
           'Guardar'
      ) : (
        'Actualizar'
      )}
    </IconButton>
    <IconButton 
      onclick={() => onDeleteIngredient(ingredient.id)}
      clase={'btn-error'}
    >
      Eliminar
    </IconButton>
  </div>
</div>
</div>;
}

export default IngredientCollapse;
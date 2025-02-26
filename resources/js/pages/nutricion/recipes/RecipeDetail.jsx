import React from "react";
import Tab from "../../../components/Tab";
import { IconButton } from "../../../components/IconButton";
import ModalAddIngredientRecipe from "./components/ModalAddIngredientRecipe";

const RecipeDetail = () => {
  return (
    <div className="px-4">
      <div className="card shadow-md">
        <div className="p-5 flex flex-col md:flex-row justify-around">
          <div className="md:ml-5 mt-5 md:mt-0">
            <h2 className="text-2xl font-bold">Recipe Name</h2>
            <p>Created on: 2023-01-01</p>
            <p>Updated on: 2023-01-10</p>
          </div>
          <div className="">
            <img
              src="recipe-photo-url"
              alt="Recipe"
              className="w-full h-auto"
            />
            <button className="btn btn-primary btn-sm">Cambiar imagen</button>
          </div>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted mt-5">
        <Tab name="tabRecipe" label="Ingredientes" checked>
          <div className="flex mb-4">
            <ModalAddIngredientRecipe />
          </div>
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              Click to open this one and close others
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
        </Tab>
        <Tab name="tabRecipe" label="Preparación">
          Prep
        </Tab>
      </div>
    </div>
  );
};

export default RecipeDetail;

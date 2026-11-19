
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    prepTimeMinutes: "",
    cookTimeMinutes: "",
    difficulty: "",
    ingredients: [{ name: "", amount: "", unite: "" }],
    instructions: [""],
  });
  const [status, setStatus] = useState({ message: "", error: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function updateRecipe(field, value) {
    setRecipe((current) => ({ ...current, [field]: value }));
  }

  function updateIngredient(index, field, value) {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? { ...ingredient, [field]: value } : ingredient,
      ),
    }));
  }

  function updateInstruction(index, value) {
    setRecipe((current) => ({
      ...current,
      instructions: current.instructions.map((instruction, instructionIndex) =>
        instructionIndex === index ? value : instruction,
      ),
    }));
  }

  function addIngredient() {
    setRecipe((current) => ({
      ...current,
      ingredients: [...current.ingredients, { name: "", amount: "", unite: "" }],
    }));
  }

  function addInstruction() {
    setRecipe((current) => ({
      ...current,
      instructions: [...current.instructions, ""],
    }));
  }

  function removeIngredient(index) {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
    }));
  }

  function removeInstruction(index) {
    setRecipe((current) => ({
      ...current,
      instructions: current.instructions.filter((_, instructionIndex) => instructionIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", error: false });

    const payload = {
      ...recipe,
      prepTimeMinutes: Number(recipe.prepTimeMinutes),
      cookTimeMinutes: Number(recipe.cookTimeMinutes),
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        amount: Number(ingredient.amount),
        unite: ingredient.unite.trim(),
      })),
      instructions: recipe.instructions.map((instruction) => instruction.trim()),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("The recipe could not be saved. Please try again.");
      }

      setStatus({ message: "Recipe added successfully!", error: false });
      router.refresh();
    } catch (error) {
      setStatus({
        message: error.message || "Something went wrong while saving the recipe.",
        error: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="add-recipe-section" aria-labelledby="add-recipe-title">
      <header className="add-recipe-heading">
        <p className="recipes-eyebrow">Share something delicious</p>
        <h2 id="add-recipe-title">Add a recipe</h2>
        <p>Enter the details, ingredients, and steps for your recipe.</p>
      </header>

      <form className="add-recipe-form" onSubmit={handleSubmit}>
        <div className="recipe-form-grid">
          <label className="recipe-field recipe-field-wide">
            Recipe title
            <input
              required
              name="title"
              value={recipe.title}
              onChange={(event) => updateRecipe("title", event.target.value)}
            />
          </label>

          <label className="recipe-field">
            Category
            <input
              required
              name="category"
              value={recipe.category}
              onChange={(event) => updateRecipe("category", event.target.value)}
            />
          </label>

          <label className="recipe-field">
            Difficulty
            <select
              name="difficulty"
              value={recipe.difficulty}
              onChange={(event) => updateRecipe("difficulty", event.target.value)}
            >
              <option value="" disabled>
                Select difficulty
              </option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <label className="recipe-field">
            Prep time (minutes)
            <input
              required
              min="0"
              type="number"
              name="prepTimeMinutes"
              value={recipe.prepTimeMinutes}
              onChange={(event) => updateRecipe("prepTimeMinutes", event.target.value)}
            />
          </label>

          <label className="recipe-field">
            Cook time (minutes)
            <input
              required
              min="0"
              type="number"
              name="cookTimeMinutes"
              value={recipe.cookTimeMinutes}
              onChange={(event) => updateRecipe("cookTimeMinutes", event.target.value)}
            />
          </label>
        </div>

        <fieldset className="recipe-form-group">
          <legend>Ingredients</legend>
          {recipe.ingredients.map((ingredient, index) => (
            <div className="ingredient-form-row" key={`ingredient-${index}`}>
              <label className="recipe-field">
                Ingredient
                <input
                  required
                  aria-label={`Ingredient ${index + 1} name`}
                  value={ingredient.name}
                  onChange={(event) => updateIngredient(index, "name", event.target.value)}
                />
              </label>
              <label className="recipe-field">
                Amount
                <input
                  required
                  min="0"
                  step="any"
                  type="number"
                  aria-label={`Ingredient ${index + 1} amount`}
                  value={ingredient.amount}
                  onChange={(event) => updateIngredient(index, "amount", event.target.value)}
                />
              </label>
              <label className="recipe-field">
                Unit
                <input
                  required
                  aria-label={`Ingredient ${index + 1} unit`}
                  value={ingredient.unite}
                  onChange={(event) => updateIngredient(index, "unite", event.target.value)}
                />
              </label>
              <button
                className="remove-row-button"
                type="button"
                aria-label={`Remove ingredient ${index + 1}`}
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="add-row-button" type="button" onClick={addIngredient}>
            + Add ingredient
          </button>
        </fieldset>

        <fieldset className="recipe-form-group">
          <legend>Instructions</legend>
          {recipe.instructions.map((instruction, index) => (
            <div className="instruction-form-row" key={`instruction-${index}`}>
              <label className="recipe-field">
                Step {index + 1}
                <textarea
                  required
                  rows="2"
                  value={instruction}
                  onChange={(event) => updateInstruction(index, event.target.value)}
                />
              </label>
              <button
                className="remove-row-button"
                type="button"
                aria-label={`Remove step ${index + 1}`}
                onClick={() => removeInstruction(index)}
                disabled={recipe.instructions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="add-row-button" type="button" onClick={addInstruction}>
            + Add step
          </button>
        </fieldset>

        <div className="recipe-form-footer">
          <p className={`recipe-form-status${status.error ? " is-error" : ""}`} role="status">
            {status.message}
          </p>
          <button className="submit-recipe-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving recipe…" : "Save recipe"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddRecipe
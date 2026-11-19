
import RecipeBox from "./RecipeBox";
import SearchBar from "./SearchBar";

async function DisplayRecipes({ searchParams }) {
    const params = await searchParams;
    const rawIngredient = Array.isArray(params?.ingredient)
        ? params.ingredient[0]
        : params?.ingredient;
    const ingredient = (rawIngredient || "").trim();

    let recipes = [];
    let loadError = false;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = ingredient
        ? `${apiUrl}/api/v1/recipes/search?ingredient=${encodeURIComponent(ingredient)}`
        : `${apiUrl}/api/v1/recipes`;

    try {
        const response = await fetch(endpoint, { cache: "no-store" });

        // L'API répond 400 quand la recherche ne trouve aucune recette
        if (ingredient && response.status === 400) {
            recipes = [];
        } else if (!response.ok) {
            throw new Error(`Recipes request failed with status ${response.status}`);
        } else {
            const data = await response.json();
            recipes = data.data;
        }
    } catch {
        loadError = true;
    }

    return (
        <main className="recipes-section">
            <header className="recipes-heading">
                <p className="recipes-eyebrow">A little inspiration</p>
                <h1>Recipes worth slowing down for</h1>
                <p className="recipes-intro">
                    Simple ideas, thoughtful ingredients, and something delicious for
                    every part of your day.
                </p>
            </header>

            <SearchBar initialQuery={ingredient} />

            {ingredient && !loadError && recipes.length > 0 && (
                <p className="recipe-search-summary" role="status">
                    {recipes.length} recipe{recipes.length > 1 ? "s" : ""} with “{ingredient}”
                </p>
            )}

            {loadError ? (
                <p className="recipes-message" role="status">
                    We couldn’t load the recipes right now. Please try again in a moment.
                </p>
            ) : recipes.length === 0 ? (
                <p className="recipes-message" role="status">
                    {ingredient
                        ? `No recipe found with “${ingredient}”. Try another ingredient.`
                        : "No recipes yet. Check back soon for something delicious."}
                </p>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe, index) => (
                        <RecipeBox
                            key={recipe._id || recipe.id || `${recipe.title}-${index}`}
                            recipe={recipe}
                            ingredientHeadingId={`ingredients-${recipe._id || recipe.id || index}`}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default DisplayRecipes;
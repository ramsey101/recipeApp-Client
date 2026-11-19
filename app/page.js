import { Suspense } from "react";
import DisplayRecipes from "./(components)/DisplayRecipes";
import AddRecipe from "./(components)/AddRecipe";

export default function Home({ searchParams }) {
  return (
    <>
      <AddRecipe />
      <Suspense fallback={<p className="recipes-message">Chargement des recettes...</p>}>
        <DisplayRecipes searchParams={searchParams} />
      </Suspense>
    </>
  );
}

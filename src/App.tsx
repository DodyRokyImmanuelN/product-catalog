import type { ChangeEvent } from 'react'
import {
  useLoaderData,
  useSearchParams,
} from 'react-router-dom'

import { catalogLoader } from './loaders/catalog-loader'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function App() {
  const {
    categories,
    subCategories,
    brands,
    products,
  } = useLoaderData<typeof catalogLoader>()

  const [searchParams, setSearchParams] = useSearchParams()

  const categoryId = searchParams.get('category')
  const subCategoryId = searchParams.get('subcategory')
  const brandId = searchParams.get('brand')

  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  )

  const availableSubCategories = selectedCategory
    ? subCategories.filter(
        (subCategory) =>
          subCategory.categoryId === selectedCategory.id,
      )
    : []

  const selectedSubCategory = availableSubCategories.find(
    (subCategory) => subCategory.id === subCategoryId,
  )

  const availableBrands = selectedSubCategory
    ? brands.filter(
        (brand) =>
          brand.subCategoryId === selectedSubCategory.id,
      )
    : []

  const selectedBrand = availableBrands.find(
    (brand) => brand.id === brandId,
  )

  const filteredProducts = products.filter((product) => {
    const productBrand = brands.find(
      (brand) => brand.id === product.brandId,
    )

    if (!productBrand) {
      return false
    }

    if (selectedBrand) {
      return product.brandId === selectedBrand.id
    }

    if (selectedSubCategory) {
      return (
        productBrand.subCategoryId === selectedSubCategory.id
      )
    }

    if (selectedCategory) {
      return availableSubCategories.some(
        (subCategory) =>
          subCategory.id === productBrand.subCategoryId,
      )
    }

    return true
  })

  const breadcrumbItems = [
    'Products',
    selectedCategory?.name,
    selectedSubCategory?.name,
    selectedBrand?.name,
  ].filter((item): item is string => Boolean(item))

  function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const nextCategoryId = event.currentTarget.value
    const nextParams = new URLSearchParams()

    if (nextCategoryId) {
      nextParams.set('category', nextCategoryId)
    }

    setSearchParams(nextParams)
  }

  function handleSubCategoryChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const nextSubCategoryId = event.currentTarget.value
    const nextParams = new URLSearchParams(searchParams)

    if (nextSubCategoryId) {
      nextParams.set('subcategory', nextSubCategoryId)
    } else {
      nextParams.delete('subcategory')
    }

    nextParams.delete('brand')
    setSearchParams(nextParams)
  }

  function handleBrandChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const nextBrandId = event.currentTarget.value
    const nextParams = new URLSearchParams(searchParams)

    if (nextBrandId) {
      nextParams.set('brand', nextBrandId)
    } else {
      nextParams.delete('brand')
    }

    setSearchParams(nextParams)
  }

  function handleReset() {
    setSearchParams({})
  }

  return (
  <main className="min-h-screen bg-white text-slate-900">
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Product Catalog
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Browse products by category and brand.
        </p>
      </header>

      <nav
        className="product-breadcrumb border-b border-slate-200 py-4 text-sm text-slate-500"
        aria-label="breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbItems.map((item, index) => {
            const isCurrent =
              index === breadcrumbItems.length - 1

            return (
              <li key={item} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                )}

                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={
                    isCurrent
                      ? 'font-medium text-slate-900'
                      : undefined
                  }
                >
                  {item}
                </span>
              </li>
            )
          })}
        </ol>
      </nav>

      <section
        aria-label="Product filters"
        className="border-b border-slate-200 py-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Main Category
            </label>

            <select
              id="category"
              name="category"
              value={selectedCategory?.id ?? ''}
              onChange={handleCategoryChange}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subcategory"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Sub-Category
            </label>

            <select
              id="subcategory"
              name="subcategory"
              value={selectedSubCategory?.id ?? ''}
              onChange={handleSubCategoryChange}
              disabled={!selectedCategory}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select a sub-category</option>

              {availableSubCategories.map((subCategory) => (
                <option
                  key={subCategory.id}
                  value={subCategory.id}
                >
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Brand
            </label>

            <select
              id="brand"
              name="brand"
              value={selectedBrand?.id ?? ''}
              onChange={handleBrandChange}
              disabled={!selectedSubCategory}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select a brand</option>

              {availableBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!selectedCategory}
          className="mt-4 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
        >
          Reset filters
        </button>
      </section>

      <section
        className="py-8"
        aria-labelledby="product-list-title"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="product-list-title"
            className="text-lg font-semibold"
          >
            Products
          </h2>

          <p
            aria-live="polite"
            className="text-sm text-slate-500"
          >
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'product'
              : 'products'}
          </p>
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const productBrand = brands.find(
              (brand) => brand.id === product.brandId,
            )

            return (
              <article
                key={product.id}
                className="flex min-h-44 flex-col bg-white p-5 transition-colors hover:bg-slate-50"
              >
                <p className="text-xs text-slate-400">
                  {product.id}
                </p>

                <h3 className="mt-4 font-medium leading-snug">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {productBrand?.name}
                </p>

                <p className="mt-auto pt-6 font-semibold">
                  {currencyFormatter.format(product.price)}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  </main>
  )
}

export default App
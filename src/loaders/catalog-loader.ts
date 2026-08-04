import {
    redirect,
    type LoaderFunctionArgs,   
} from 'react-router-dom'

import { catalogData } from '../data/catalog'

export function catalogLoader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const normalizedParams = new URLSearchParams()

    const categoryId = url.searchParams.get('category')
    const subCategoryId = url.searchParams.get('subcategory')
    const brandId = url.searchParams.get('brand')

    const category = catalogData.categories.find(
        (item) => item.id === categoryId,
    )

    if (category) {
        normalizedParams.set('category', category.id)

        const subCategory = catalogData.subCategories.find(
            (item) => item.id === subCategoryId && item.categoryId === category.id,
        )

        if (subCategory) {
            normalizedParams.set('subcategory', subCategory.id)

            const brand = catalogData.brands.find(
                (item) => item.id === brandId && item.subCategoryId === subCategory.id,
            )

            if (brand) {
                normalizedParams.set('brand', brand.id)
            }
        }
    }

    if (normalizedParams.toString() !== url.searchParams.toString()) {
        const query = normalizedParams.toString()

        return redirect(`${url.pathname}${query ? `?${query}` : ''}`)

    }
    return catalogData
}
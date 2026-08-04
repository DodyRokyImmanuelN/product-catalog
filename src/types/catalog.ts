export interface Category {
  id: string
  name: string
}

export interface SubCategory {
  id: string
  categoryId: string
  name: string
}

export interface Brand {
  id: string
  subCategoryId: string
  name: string
}

export interface Product {
  id: string
  brandId: string
  name: string
  price: number
}

export interface CatalogData {
  categories: Category[]
  subCategories: SubCategory[]
  brands: Brand[]
  products: Product[]
}
from modeltranslation.translator import register, TranslationOptions
from .models import Category, Food

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Food)
class FoodTranslationOptions(TranslationOptions):
    fields = ('name', 'description')

from rest_framework.routers import SimpleRouter
from .views import ChatBotViewSet


router = SimpleRouter()

router.register("chat", ChatBotViewSet, basename='chat')

urlpatterns = router.urls

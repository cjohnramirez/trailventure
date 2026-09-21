import math

from django.http import Http404
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import cache, selectors
from .serializers import (
    DestinationSerializer,
    PackageCardSerializer,
    PackageDetailSerializer,
    PackagePageSerializer,
    PackageSearchQuerySerializer,
)

SEARCH_PAGE_SIZE = 6


@extend_schema(
    operation_id="destinations_list",
    parameters=[OpenApiParameter("featured", bool, description="Only home page destinations")],
    responses=DestinationSerializer(many=True),
)
@api_view(["GET"])
@permission_classes([AllowAny])
def destination_list(request):
    featured = request.query_params.get("featured") in {"1", "true"}
    data = cache.cached(
        "destinations",
        {"featured": featured},
        lambda: (
            DestinationSerializer(
                selectors.destination_list(featured_only=featured), many=True
            ).data
        ),
    )
    return Response(data)


@extend_schema(
    operation_id="packages_list",
    parameters=[PackageSearchQuerySerializer],
    responses=PackagePageSerializer,
)
@api_view(["GET"])
@permission_classes([AllowAny])
def package_list(request):
    query = PackageSearchQuerySerializer(data=request.query_params)
    query.is_valid(raise_exception=True)
    params = query.validated_data

    def compute():
        search = selectors.PackageSearch(
            destination=params.get("destination"),
            query=params.get("q"),
            start=params.get("start"),
            end=params.get("end"),
            min_price=params["min_price"] * 100 if "min_price" in params else None,
            max_price=params["max_price"] * 100 if "max_price" in params else None,
            rating=params.get("rating"),
        )
        packages = selectors.package_search(search)
        count = packages.count()
        total_pages = max(1, math.ceil(count / SEARCH_PAGE_SIZE))
        page = min(params["page"], total_pages)
        offset = (page - 1) * SEARCH_PAGE_SIZE
        return {
            "count": count,
            "page": page,
            "page_size": SEARCH_PAGE_SIZE,
            "total_pages": total_pages,
            "results": PackageCardSerializer(
                packages[offset : offset + SEARCH_PAGE_SIZE], many=True
            ).data,
        }

    return Response(cache.cached("packages", params, compute))


@extend_schema(operation_id="packages_retrieve", responses=PackageDetailSerializer)
@api_view(["GET"])
@permission_classes([AllowAny])
def package_detail(request, slug: str):
    def compute():
        package = selectors.package_detail(slug)
        return PackageDetailSerializer(package).data if package else None

    data = cache.cached("package", {"slug": slug}, compute)
    if data is None:
        raise Http404("Package not found.")
    return Response(data)

// src/components/main/StationInfo.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import FilteredRestaurantListDisplay from "./FilteredRestaurantListDisplay";
import { CATEGORY_DEFINITIONS } from "../../constants/categoryConstants.jsx";

const StationInfo = ({ stationName, onRestaurantSelect }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_DEFINITIONS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!stationName) {
      setRestaurants([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/restaurants/station/${encodeURIComponent(stationName)}`
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(
          errorData.message || `데이터를 불러오는데 실패했습니다. 상태 코드: ${res.status}`
        );
      }

      const data = await res.json();

      const allowedCategories = CATEGORY_DEFINITIONS.map(c => c.value).filter(v => v !== "전체");

      const mappedData = data.map(item => ({
        ...item,
        category: allowedCategories.includes(item.category) ? item.category : "기타"
      }));

      setRestaurants(Array.isArray(mappedData) ? mappedData : []);
    } catch (err) {
      console.error("[StationInfo] fetchData 에러:", err);
      setError(err.message || "음식점 정보를 불러오는 중 오류가 발생했습니다.");
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, [stationName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryChange = useCallback((event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    } else {
      setSelectedCategory(CATEGORY_DEFINITIONS[0].value);
    }
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    if (selectedCategory === CATEGORY_DEFINITIONS[0].value || selectedCategory === null) {
      return restaurants;
    }
    return restaurants.filter(
      (r) => (r.category || "기타") === selectedCategory
    );
  }, [restaurants, selectedCategory]);

  if (isLoading && restaurants.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 3, flexDirection: "column" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>맛집 정보를 불러오는 중입니다... 🍜</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2 }, width: "100%" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        {stationName ? `${stationName}역 근처 음식점 🍽️` : "역을 선택해주세요."}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0.5, marginBottom: 3 }}>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          aria-label="음식점 카테고리"
          size="medium"
        >
          {CATEGORY_DEFINITIONS.map((catDef) => (
            <ToggleButton
              key={catDef.value}
              value={catDef.value}
              aria-label={catDef.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: { xs: 1, sm: 1.5 },
                textTransform: 'none',
              }}
            >
              {catDef.icon}
              <Typography variant="body2" component="span" sx={{ display: { xs: "none", sm: "inline" }, lineHeight: 1 }}>
                {catDef.label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === "string" ? error : error.message}
        </Alert>
      )}

      <FilteredRestaurantListDisplay
        stationName={stationName}
        category={selectedCategory}
        restaurants={filteredRestaurants}
        onRestaurantSelect={onRestaurantSelect}
      />
    </Box>
  );
};

export default StationInfo;
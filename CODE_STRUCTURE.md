# Cấu trúc Code Frontend - S Cộng Studio

## Tổ chức thư mục

```
src/
├── constants/          # Dữ liệu tĩnh và cấu hình
│   ├── navigation.js   # Navigation links
│   ├── studios.js       # Studio data
│   ├── features.js     # Features data
│   ├── testimonials.js # Testimonials data
│   ├── stats.js        # Statistics data
│   ├── contact.js      # Contact information
│   └── team.js         # Team members data
│
├── components/
│   ├── common/         # Reusable components
│   │   ├── Section.jsx        # Section wrapper với animation
│   │   ├── AnimatedCard.jsx   # Card với 3D animation
│   │   └── IconBox.jsx        # Icon box với gradient
│   └── layout/         # Layout components
│
├── hooks/              # Custom React hooks
│   └── useScrollEffect.js  # Hook cho scroll effect
│
├── utils/              # Utility functions
│   └── animations.js   # Animation variants
│
└── pages/              # Page components
```

## Nguyên tắc thiết kế

1. **Separation of Concerns**: Tách data, logic, và UI
2. **Reusability**: Tạo components và hooks tái sử dụng
3. **Maintainability**: Code dễ đọc, dễ bảo trì
4. **Performance**: Tối ưu animations và rendering
5. **Consistency**: Sử dụng constants cho data chung

## Cách sử dụng

### Constants
```javascript
import { NAV_LINKS, STUDIOS, FEATURES } from '../constants';
```

### Reusable Components
```javascript
import Section from '../components/common/Section';
import AnimatedCard from '../components/common/AnimatedCard';
```

### Custom Hooks
```javascript
import { useScrollEffect } from '../hooks/useScrollEffect';
```


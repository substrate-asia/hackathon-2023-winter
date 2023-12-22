# RealXchange TODo

### Meta data to be worked on.

- Core project Category
```javascript
     CategoryName = 'ecology' | 'housing' | 'environment' | 'social';
```

- Endpoint for Foundation Profile
```javascript
 interface {
 foundation_name: string
 image: string;
 website_url: string | null
 tag_name: string 
 about: string
}
```

- Endpoint to create foundation Project 
```javascript
interface Project {
  id: string | number;
  title: string;
  foundationName: string;
  location: string;
  category: CategoryName;
  description: string;
  funding_target: number,
  duration: Date,
  supporting_documents: pdf | image | ptff []
}
```

 - NFT Activity
 - Project Activity
 - Mint NFT
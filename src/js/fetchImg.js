import axios from 'axios';

const pageLimit = 40;

const fetchImages = async (queryToFetch, pageToFetch) => {

    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '39241175-920eb89e79fcd4cc7c8ced0a6';
    

     const params = new URLSearchParams({
        key: API_KEY,
        q: queryToFetch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageToFetch,
        per_page: pageLimit,
      });
    
      const response = await axios.get(`${BASE_URL}?${params}`);
      return response.data;
    }
    
    
    
    export { fetchImages, pageLimit };    
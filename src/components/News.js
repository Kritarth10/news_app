import React, {useState,useEffect} from "react";
import NewsItems from "./NewsItems";
import axios from "axios";
import Spinner from "./spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [article,setArticle]=useState([]);
    const [loading,setLoading]=useState(true)
    const [page,setPage]=useState(1)
    const [totalResults,setTotalResults]=useState(0)
    const updateNews=async() => {
        props.setProgress(10)
            setLoading(true)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        props.setProgress(25)
        let response = await axios.get(url);
        props.setProgress(50)
        let parsedResponse = await response.data;
        props.setProgress(100)
        setArticle(parsedResponse.articles)
        setLoading(false)
        setTotalResults(parsedResponse.totalResults)
    }
     const fetchMoreData=async()=>{
         const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
            setPage(page=>page+1)
         let response = await axios.get(url);
         let parsedResponse = await response.data;
         setArticle(article.concat(parsedResponse.articles))
         setTotalResults(parsedResponse.totalResults)
    }
    useEffect(()=> {
        document.title='NewsApp'
        updateNews();
    },[]);

        return(
            <>
                <h2 className="text-center" style={{margin:"30px 0px", marginTop:"70px"}}>Express News - Top Headlines</h2>
                {loading && <Spinner/>}

                     <div className="container"   >
                         <div className="row">
                           {article.map((element,index)=>{
                                  return (<div className="col-md-4" key={element.url}>
                                              <NewsItems title={element.title.length>45?element.title.slice(0,45):element.title} description={element.description?(element.description.length>60?element.description.slice(0,60):element.description):"No description"}
                                       imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                                          </div>)
                                  })}

                     </div>
                </div>
                <InfiniteScroll
                    dataLength={article.length}
                    next={fetchMoreData}
                    hasMore={article.length !== totalResults}
                    loader={<Spinner/>}
                >
                    </InfiniteScroll>
            </>
        )
}
News.defaultProps={
    country:"in",
    pageSize:5,
    category:"general"
}
News.propTypes={
    country:PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string

}
export default News
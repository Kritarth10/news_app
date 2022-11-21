import React,{Component} from "react";
import NewsItems from "./NewsItems";
import axios from "axios";
import {Spinner} from "./spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component{
    constructor() {
        super();
        this.state = {
            article : [],
            loading:true,
            page:1,
            totalResults:0
        }
    }
    static defaultProps={
        country:"in",
        pageSize:5,
        category:"general"
    }
    static propTypes={
        country:PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string

    }
    async updateNews(props){
        this.props.setProgress(0);
        console.log("Page number from inside update news-----", this.state.page)
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.props.setProgress(25);
        this.setState({
            loading:true
        })
        let response = await axios.get(url);
        this.props.setProgress(50);
        let parsedResponse = await response.data;
        this.props.setProgress(75);
        this.setState({
            article:parsedResponse.articles,
            totalResults:parsedResponse.totalResults,
            loading:false
        })
        this.props.setProgress(100);
    }
     fetchMoreData=async()=>{
         // console.log("Page number from inside fetch more data before set state-----", this.state.page)
        await this.setState({
            page:this.state.page+1
        })
         // console.log("Page number from inside fetch more data after set state-----", this.state.page)
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        let response = await axios.get(url);
        let parsedResponse = await response.data;
        this.setState({
            article:this.state.article.concat(parsedResponse.articles),
            totalResults:parsedResponse.totalResults,
        })
         // console.log("Page number from inside fetch more data after set state again-----", this.state.page)
    }
    async componentDidMount() {
       this.updateNews();
    }
    handlePrevpage=async()=>{
        this.setState({
            page:this.state.page-1
        })
        this.updateNews();
    }
    handleNextpage = async ()=>{
            this.setState({
                page:this.state.page+1
            })
        this.updateNews();
    }

    render(){
        return(
            <>
                <h2 className="my-3 text-center" style={{margin:"40px 0px"}}>Express News - Top Headlines</h2>
                {this.state.loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.article.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.article.length!==this.state.totalResults}
                    loader={<h4>Loading...</h4>}
                      >
                     <div className="container"   >
                         <div className="row">
                           {this.state.article.map((element,index)=>{
                                  return <div className="col-md-4" key={element.url}>
                                              <NewsItems title={element.title.length>45?element.title.slice(0,45):element.title} description={element.description?(element.description.length>60?element.description.slice(0,60):element.description):"No description"}
                                       imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} publishedAt={element.publishedAt} source={element.source.name}/>
                                          </div>
                                  })}

                     </div>
                </div>
                    </InfiniteScroll>
                {/*<div className="container d-flex justify-content-between my-3">*/}
                {/*    <button type="button" disabled={this.state.page<=1} className="btn btn-dark" onClick={this.handlePrevpage}>&larr; Previous</button>*/}
                {/*    <button type="button" disabled={(this.state.page+1)>(Math.ceil(this.state.totalResults/this.props.pageSize))} className="btn btn-dark" onClick={this.handleNextpage}>Next &rarr; </button>*/}
                {/*</div>*/}
            </>
        )
    }
}
export default News
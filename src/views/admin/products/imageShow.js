import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { getProducts } from "../../_redux_/productsSlice";
import { red } from '@material-ui/core/colors';
import { useLocation } from "react-router";


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: "100%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function ImageShow() {
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [product, setProduct] = useState([])
    const classes = useStyles();
    let location = useLocation();
    useEffect(() => {       
        getProducts(ids).then(result => setProduct(result.data))
    }, [location]);

    function check(image){
        if(image !== undefined){
           return JSON.parse(image )
        }
    }
    
    // async function run() {
    //     let responseText1, responseText2;
      
    //     try {
    //       responseText1 = await (product.images?.original );
    //     //   responseText2 = await doAsync("https://other.com");
    //     } catch (error) {
    //       /*
    //        * 'error' is corresponding with 'xhr.statusText'
    //        * from either 'https://something.com' or 'https://other.com'
    //        */
    //     }
    //   }
    

    const image = check(product?.images?.storage) ;
    const linkImage = image === undefined? "https://www.drjainsherbals.com/wp-content/uploads/2015/12/no-product-image.jpg" :`http://139.180.207.4:84/storage/${image}`    
    console.log("show",product?.images?.storage)
    return (
        <Card className={classes.card}>
            <CardContent>
                <a href={linkImage}>
                    <img src ={linkImage} style={{width: "100%", height: "340px"}}></img>
                </a>    
            </CardContent>
            
        </Card>
    );
}
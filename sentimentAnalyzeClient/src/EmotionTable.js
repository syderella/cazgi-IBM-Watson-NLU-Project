import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {

    render() {
        // const  emotionalList = this.props.emotions
        // console.log(emotionalList)
          if (this.props.emotions === "Bad URL"){
              return (
                    <div style={{color:"orange",fontSize:20}}>Invalid URL .. Please try again</div>
              )
        }

         if (this.props.emotions === "undetect"){
             return (
                    <div style={{color:"orange",fontSize:20}}>Undetect words.. Please try again or type more words..</div>
              )
         }
      return (
      
        <div>
          <table className="table table-bordered">
            <tbody>
            {   
                  Object.entries(this.props.emotions).map( (emotion, index) => {
                         return (
                             <tr key={index}>
                              <td>{emotion[0]}</td>
                               <td>{emotion[1]}</td>
                             </tr> 
                               )   
                          }
                  )  
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
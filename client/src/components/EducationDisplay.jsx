import React, { Fragment } from 'react';
import axios from 'axios';
export default function EducationDisplay(props) {
    async function handleClick(event){
        let education_id=event.target.id;
        console.log(education_id);
        //delete request to api/profile/education/education_id;
        try {
            let config={
                headers:{
                    'x-auth-token':props.jwt
                }
            }
            let url=`http://localhost:5000/api/profile/education/${education_id}`
            let response=await axios.delete(url,config);
            if(response.data.errors)
            throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            props.setRefetch(!props.refetch);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (<Fragment>
        <h2 className="my-2">Education Credentials</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>School</th>
                    <th className="hide-sm">Degree</th>
                    <th className="hide-sm">Years</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {props.educationData.map((education, ind) => {
                    return (
                        <tr key={ind}>
                            <td>{education.school}</td>
                            <td className="hide-sm">{education.display}</td>
                            <td className="hide-sm">
                                {education.from.substring(0,10)} - {education.to?education.to.substring(0,10):"present"}
                            </td>
                            <td>
                                <button onClick={handleClick} id={education._id} className="btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </Fragment>)
}
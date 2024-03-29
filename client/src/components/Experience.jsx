import React,{Fragment} from 'react'
import axios from 'axios';
export default function Experience(props){
    console.log(props.experienceData);
    async function handleClick(event){
        let experience_id=event.target.id;
        console.log(experience_id);
        //delete experience with expereience id to api/profile/id
        try {
            let config={
                headers:{
                    'x-auth-token':props.jwt
                }
            }
            let url=`http://localhost:5000/api/profile/experience/${experience_id}`
            let response=await axios.delete(url,config);
            if(response.data.errors)
            throw Error(response.data.errors[0].message || response.data.errors[0].msg)
            console.log(response.data);
            props.setRefetch(!props.refetch);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.experienceData.map((experience,ind)=>{
                            return (<tr key={ind}>
                        <td>{experience.company}</td>
                        <td className="hide-sm">{experience.title}</td>
                        <td className="hide-sm">
                            {experience.from.substring(0,10)} - {experience.to?experience.to.substring(0,10):"Present"}
                        </td>
                        <td>
                            <button onClick={handleClick} id={experience._id} className="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>)
                        })
                    }
                </tbody>
            </table>
        </Fragment>
    )
}
import React,{useContext} from "react";
import { Link,Navigate } from "react-router-dom";
import AuthContext from "./context/auth-context";
export default function DashBoard() {
    const auth=useContext(AuthContext);
    return (
        <section class="container">
            {auth.jwt.length===0 && <Navigate to='/login' />}
            <h1 class="large text-primary">
                Dashboard
            </h1>
            <p class="lead"><i class="fas fa-user"></i> Welcome John Doe</p>
            <div class="dash-buttons">
                <a href="edit-profile.html" class="btn btn-light"><i class="fas fa-user-circle text-primary"></i> Edit Profile</a>
                <a href="add-experience.html" class="btn btn-light"><i class="fab fa-black-tie text-primary"></i> Add Experience</a>
                <a href="add-education.html" class="btn btn-light"><i class="fas fa-graduation-cap text-primary"></i> Add Education</a>
            </div>

            <h2 class="my-2">Experience Credentials</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th class="hide-sm">Title</th>
                        <th class="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tech Guy Web Solutions</td>
                        <td class="hide-sm">Senior Developer</td>
                        <td class="hide-sm">
                            02-03-2009 - 01-02-2014
                        </td>
                        <td>
                            <button class="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Udemy</td>
                        <td class="hide-sm">Instructor & Developer</td>
                        <td class="hide-sm">
                            02-03-2015 - Now
                        </td>
                        <td>
                            <button class="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 class="my-2">Education Credentials</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th class="hide-sm">Degree</th>
                        <th class="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Northern Essex</td>
                        <td class="hide-sm">Associates</td>
                        <td class="hide-sm">
                            02-03-2007 - 01-02-2009
                        </td>
                        <td>
                            <button class="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="my-2">
                <button class="btn btn-danger">
                    <i class="fas fa-user-minus"></i>

                    Delete My Account
                </button>
            </div>
        </section>
    );
}
﻿import React, { Component } from 'react';
import groupPage from './images/groupPage.jpg';
import Modal from 'react-modal';
import { InstanceModal } from './InstanceModal';
import { LoginModal } from './LoginModal';
import './styles/CatalogInstances.css';
import './styles/Tables.css';
import toastr from 'toastr'

export class CatalogInstances extends Component {
    displayName = CatalogInstances.name

    constructor(props) {
        super(props);
        this.state = {
            instances: [],
            showM: false,
            modalInstance: null,
            LoginModalInstance: null,
        };

        toastr.options = {
            positionClass: 'toast-top-center',
            hideDuration: 3000,
            timeOut: 5000,
            newestOnTop: true,

        }
    }

    componentDidMount() {
        document.title = "Keeping Safety Smart | Classes";

        fetch('/api/Instances/GetInstanceByCourseId/' + this.props.match.params.courseId, { credentials: 'same-origin' })
            .then(response => response.json())
            .then(data => {
                this.setState({ instances: data, loading: false });
                console.log(data);
            });
       
    }
    showModal = (instance) => {
        if (instance.seatsAvailable == 0) {
            toastr.info("This class is full. If you are interested in taking this class, please email beckey@keepingsafetysmart.com").css("width", "350px")
            return;
        }
        if (!this.state.show) {
            this.setState({
                ...this.state,
                modalInstance: instance,
                show: !this.state.show,
            });
        }
        else {
            this.setState({
                ...this.state,
                show: !this.state.show,
            });
        }
    }

    showLoginModal = (instance) => {
        if (instance.seatsAvailable == 0) {
            toastr.info("This class is full. If you are interested in taking this class, please email beckey@keepingsafetysmart.com").css("width", "350px")
            return;
        }
        if (!this.state.showLogin) {
            this.setState({
                ...this.state,
                showLogin: !this.state.showLogin,
            })
        }
        else {
            this.setState({
                ...this.state,
                LoginModalInstance: instance,
                showLogin: !this.state.showLogin,
            })
        }
    }

    checkFull = () => {
     
    }
   
    render() {
        if (!this.state.instances[0]) {
            var noClasses = (
                <p className="kssnotify" >Sorry, no classes are currently scheduled.</p>
            );
        }

        var disabled = false;
        var hideButton = false;

        var Ldisabled = true;
        var LhideButton = true;
        if (!this.props.loginState.loggedIn) {
            disabled = true;
            hideButton = true;
            Ldisabled = false;
            LhideButton = false;
        }
        else {
            disabled = false;
            hideButton = false;
            Ldisabled = true;
            LhideButton = true;
        }

        return (
            <div>
                <div id="catalogBanner" alt="Group Safety Classes" />

                <div className="catalogInfo">
                    <div>
                        <h2>{this.props.location.state.courseName}</h2>
                        <p>{this.props.location.state.courseDescription}</p>
                    </div>
                </div>
                <div className="catalogClasses">
                    <div className="courseClasses">
                        <h4>Upcoming Classes</h4>
                        {noClasses}
                        {this.state.instances.map(instance =>
                            (
                                <div className="courseClass" key={instance.enrollmentId}>
                                    <div className="courseClassLeft">
                                        {instance.startDateDOW}< br />
                                        <span>
                                            {instance.startDateMonthF3} {instance.startDateDay}< br />
                                        </span>
                                        {instance.startDateTime}
                                    </div>
                                    <div className="seperator" />
                                    <div className="courseClassMiddle">
                                        Price: ${instance.price}<br />
                                        Open Seats: {instance.seatsAvailable}<br />
                                        {instance.locationName}<br />
                                        {instance.instructorName}
                                    </div>
                                    <div className="courseClassRight">

                                        <button
                                            className="redButton"
                                            onClick={
                                                () => this.showModal(instance)
                                            }
                                            disabled={disabled}
                                            hidden={hideButton}
                                        >Book!
                                        </button>
                                        <button
                                            className="redButton"
                                            onClick={
                                                () => this.showLoginModal(instance)
                                            }
                                            disabled={Ldisabled}
                                            hidden={LhideButton}
                                        >Book!
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                
                <InstanceModal
                    show={this.state.show}
                    onClose={this.showModal}
                    modalInstance={this.state.modalInstance}
                />  
                <LoginModal
                    show={this.state.showLogin}
                    onClose={this.showLoginModal}
                    modalInstance={this.state.loginModalInstance}
                />
            </div>
        );
    }
}
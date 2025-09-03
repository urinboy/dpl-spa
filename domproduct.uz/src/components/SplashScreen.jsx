import React from 'react';

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <div className="splash-icon-container">
                {/* DPL loading gif ishlatiladi */}
                <img src="/dpl-loading.gif" alt="DPL Loading" className="splash-icon" />
            </div>
        </div>
    );
};

export default SplashScreen;

import React from "react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-border/60 bg-white shadow-xl p-6 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-secondary">Admin Panel</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/60 p-5">
              <div className="text-sm text-muted-foreground">Orders</div>
              <div className="text-2xl font-semibold">Coming soon</div>
            </div>
            <div className="rounded-2xl border border-border/60 p-5">
              <div className="text-sm text-muted-foreground">Menu Items</div>
              <div className="text-2xl font-semibold">Coming soon</div>
            </div>
            <div className="rounded-2xl border border-border/60 p-5">
              <div className="text-sm text-muted-foreground">Customers</div>
              <div className="text-2xl font-semibold">Coming soon</div>
            </div>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            Add admin tools here (manage menu, orders, offers, and gallery).
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  AccountSettings,
  SettingsNavigation,
} from "~/components/settings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Volver</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tu cuenta y preferencias de la aplicación
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar */}
          <SettingsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "privacy" && <PrivacySettings />}
            {activeTab === "account" && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

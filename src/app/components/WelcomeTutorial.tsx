import { useState, useEffect } from "react";
import { X, ArrowRight, Settings, ExternalLink, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function WelcomeTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le tutoriel
    const hasSeenTutorial = localStorage.getItem("hasSeenWelcomeTutorial");
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenWelcomeTutorial", "true");
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const steps = [
    {
      title: "Bienvenue sur le Portail Qualité !",
      description:
        "Ce portail centralise les données de SonarQube, OWASP ZAP et Wazuh pour surveiller la qualité et la sécurité de vos applications.",
      icon: CheckCircle,
      color: "blue",
    },
    {
      title: "Données de démonstration",
      description:
        "Pour l'instant, vous voyez des données d'exemple. Vous pouvez explorer toutes les fonctionnalités sans configuration.",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Configurez vos APIs",
      description:
        "Pour afficher vos vraies données, allez dans Paramètres et configurez les URLs et identifiants de vos outils.",
      icon: Settings,
      color: "orange",
    },
    {
      title: "Accédez aux interfaces",
      description:
        "Une fois configurés, des liens apparaîtront pour accéder directement aux interfaces natives de chaque outil.",
      icon: ExternalLink,
      color: "purple",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div
          className={`p-6 bg-gradient-to-r ${
            currentStep.color === "blue"
              ? "from-blue-500 to-blue-600"
              : currentStep.color === "green"
              ? "from-green-500 to-green-600"
              : currentStep.color === "orange"
              ? "from-orange-500 to-orange-600"
              : "from-purple-500 to-purple-600"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium">
                  Étape {step + 1} sur {steps.length}
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {currentStep.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {currentStep.description}
          </p>

          {step === 2 && (
            <Link
              to="/settings"
              onClick={handleClose}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Settings className="w-4 h-4" />
              Aller aux paramètres
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === step
                    ? "w-8 bg-blue-600"
                    : index < step
                    ? "w-1.5 bg-green-500"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Passer
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
            >
              {step < steps.length - 1 ? "Suivant" : "Commencer"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

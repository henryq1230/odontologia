import 'package:flutter/material.dart';

class ThankYouScreen extends StatefulWidget {
  const ThankYouScreen({super.key});

  @override
  State<ThankYouScreen> createState() => _ThankYouScreenState();
}

class _ThankYouScreenState extends State<ThankYouScreen> {
  int _currentStep = 0;
  bool _isProvisioned = false;

  // Design tokens
  static const Color primaryColor = Color(0xFF00327D);
  static const Color secondaryColor = Color(0xFFE3F2FD);
  static const Color accentColor = Color(0xFFFFB300);
  static const Color textMuted = Color(0xFF434653);

  final List<Map<String, String>> _provisioningSteps = [
    {"title": "Pago procesado exitosamente", "desc": "Suscripción confirmada por TiloPay."},
    {"title": "Creando tu base de datos clínica", "desc": "Instanciando PostgreSQL aislado de forma segura."},
    {"title": "Generando subdominio de acceso", "desc": "Registrando clínica en los DNS de Cloudflare."},
    {"title": "¡Tu clínica está lista!", "desc": "Ya puedes iniciar sesión en OdontologIA."}
  ];

  @override
  void initState() {
    super.initState();
    _startProvisioningSimulation();
  }

  void _startProvisioningSimulation() {
    // Simulate steps completion every 2.5 seconds
    Future.forEach(List.generate(3, (index) => index + 1), (step) {
      return Future.delayed(const Duration(milliseconds: 2000), () {
        if (mounted) {
          setState(() {
            _currentStep = step;
            if (step == 3) {
              _isProvisioned = true;
            }
          });
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              // Success Animated Icon
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _isProvisioned ? Colors.green.shade50 : secondaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _isProvisioned ? Icons.check_circle : Icons.hourglass_top_rounded,
                    size: 48,
                    color: _isProvisioned ? Colors.green : primaryColor,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Title & Message
              Center(
                child: Text(
                  _isProvisioned ? '¡Todo Listo!' : 'Procesando tu Alta...',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: primaryColor,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Center(
                child: Text(
                  'Estamos preparando el entorno de tu clínica OdontologIA.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: textMuted, fontSize: 13),
                ),
              ),
              const SizedBox(height: 40),

              // Steps List (Vertical Progress)
              Expanded(
                child: ListView.builder(
                  itemCount: _provisioningSteps.length,
                  itemBuilder: (context, index) {
                    final isCompleted = index < _currentStep;
                    final isCurrent = index == _currentStep;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 24.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Progress dot indicator
                          Column(
                            children: [
                              Container(
                                width: 20,
                                height: 20,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isCompleted
                                      ? Colors.green
                                      : (isCurrent ? primaryColor : Colors.grey.shade300),
                                ),
                                child: isCompleted
                                    ? const Icon(Icons.check, size: 12, color: Colors.white)
                                    : null,
                              ),
                              if (index < _provisioningSteps.length - 1)
                                Container(
                                  width: 2,
                                  height: 40,
                                  color: isCompleted ? Colors.green : Colors.grey.shade300,
                                ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          
                          // Step Text details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _provisioningSteps[index]["title"]!,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: isCompleted || isCurrent ? Colors.black : Colors.grey.shade500,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _provisioningSteps[index]["desc"]!,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isCompleted || isCurrent ? textMuted : Colors.grey.shade400,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              // CTA Action Button (Only enabled when fully provisioned)
              ElevatedButton(
                onPressed: _isProvisioned
                    ? () {
                        // Redirect client to login screen
                        Navigator.pushReplacementNamed(context, '/login');
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey.shade300,
                  disabledForegroundColor: Colors.grey.shade500,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4.0)),
                  elevation: 0,
                ),
                child: Text(
                  _isProvisioned ? 'Ingresar a mi Clínica' : 'Aprovisionando Entorno...',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

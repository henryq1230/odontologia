import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/patient_screen.dart';
import 'screens/thank_you_screen.dart';

void main() {
  runApp(const OdontologiaApp());
}

class OdontologiaApp extends StatelessWidget {
  const OdontologiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OdontologIA Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00327D),
          primary: const Color(0xFF00327D),
        ),
        useMaterial3: true,
        fontFamily: 'Inter',
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/patient': (context) => const PatientScreen(),
        '/thank-key': (context) => const ThankYouScreen(), // Test routing
        '/dashboard': (context) => Scaffold(
              appBar: AppBar(
                title: const Text(
                  'OdontologIA Dashboard',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                backgroundColor: const Color(0xFF00327D),
                centerTitle: true,
                elevation: 0,
              ),
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_outline, size: 64, color: Colors.green),
                      const SizedBox(height: 16),
                      const Text(
                        '¡Sesión Iniciada Exitosamente!',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Conectado a la base de datos de tu clínica dental en tiempo real.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                      const SizedBox(height: 32),
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/patient'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF00327D),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                        child: const Text('Ver Ficha de Paciente (Elena R.)'),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/thank-key'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF00327D),
                          side: const BorderSide(color: Color(0xFF00327D)),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                        child: const Text('Simular Flujo Agradecimiento'),
                      ),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                        child: const Text('Cerrar Sesión'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
      },
    );
  }
}

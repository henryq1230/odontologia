import 'package:flutter/material.dart';

class PatientScreen extends StatefulWidget {
  const PatientScreen({super.key});

  @override
  State<PatientScreen> createState() => _PatientScreenState();
}

class _PatientScreenState extends State<PatientScreen> {
  // Mock patient data
  final String name = "Elena Rodríguez";
  final int age = 34;
  final String lastVisit = "2026-06-24";
  final String activeTreatment = "Tratamiento de Canales";

  // State of teeth: { toothNum: { 'absent': bool, 'surfaces': { 'top': bool, 'center': bool... } } }
  final Map<int, Map<String, dynamic>> _teethConditions = {};
  String _selectedCondition = 'caries'; // 'caries', 'restored', 'absent', 'clear'

  // Colors matching Stitch design system
  static const Color primaryColor = Color(0xFF00327D);
  static const Color secondaryColor = Color(0xFFE3F2FD);
  static const Color accentColor = Color(0xFFFFB300);
  static const Color textMuted = Color(0xFF434653);

  final List<int> _upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  final List<int> _lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  void _onToothTap(int toothNumber) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final hasCondition = _teethConditions.containsKey(toothNumber);
            final isAbsent = hasCondition && _teethConditions[toothNumber]!['absent'] == true;
            final isRestored = hasCondition && _teethConditions[toothNumber]!['restored'] == true;
            final hasCaries = hasCondition && _teethConditions[toothNumber]!['caries'] == true;

            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Pieza Dental $toothNumber - Diagnóstico',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor),
                  ),
                  const SizedBox(height: 16),
                  ListTile(
                    leading: const Icon(Icons.warning_amber_rounded, color: Colors.red),
                    title: const Text('Caries Activa'),
                    trailing: Switch(
                      value: hasCaries,
                      onChanged: (val) {
                        setState(() {
                          _teethConditions[toothNumber] = {
                            ..._teethConditions[toothNumber] ?? {},
                            'caries': val,
                            if (val) ...{'absent': false, 'restored': false}
                          };
                        });
                        setModalState(() {});
                      },
                    ),
                  ),
                  ListTile(
                    leading: const Icon(Icons.bookmark_added_outlined, color: Colors.blue),
                    title: const Text('Calza / Restaurada'),
                    trailing: Switch(
                      value: isRestored,
                      onChanged: (val) {
                        setState(() {
                          _teethConditions[toothNumber] = {
                            ..._teethConditions[toothNumber] ?? {},
                            'restored': val,
                            if (val) ...{'absent': false, 'caries': false}
                          };
                        });
                        setModalState(() {});
                      },
                    ),
                  ),
                  ListTile(
                    leading: const Icon(Icons.cancel_outlined, color: textMuted),
                    title: const Text('Ausente / Extraído'),
                    trailing: Switch(
                      value: isAbsent,
                      onChanged: (val) {
                        setState(() {
                          _teethConditions[toothNumber] = {
                            ..._teethConditions[toothNumber] ?? {},
                            'absent': val,
                            if (val) ...{'caries': false, 'restored': false}
                          };
                        });
                        setModalState(() {});
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('Confirmar'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildToothWidget(int number) {
    final condition = _teethConditions[number];
    final isAbsent = condition != null && condition['absent'] == true;
    final isRestored = condition != null && condition['restored'] == true;
    final hasCaries = condition != null && condition['caries'] == true;

    Color toothColor = Colors.white;
    if (isAbsent) {
      toothColor = Colors.grey.shade300;
    } else if (hasCaries) {
      toothColor = Colors.red.shade100;
    } else if (isRestored) {
      toothColor = Colors.blue.shade100;
    }

    return GestureDetector(
      onTap: () => _onToothTap(number),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4.0),
        width: 48,
        height: 60,
        decoration: BoxDecoration(
          color: toothColor,
          border: Border.all(
            color: hasCaries ? Colors.red : (isRestored ? Colors.blue : const Color(0xFFC3C6D5)),
            width: (hasCaries || isRestored) ? 2.0 : 1.0,
          ),
          borderRadius: BorderRadius.circular(4.0),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$number',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: (hasCaries || isRestored) ? Colors.black : textMuted,
              ),
            ),
            const SizedBox(height: 2),
            if (isAbsent)
              const Icon(Icons.close, size: 14, color: Colors.red)
            else if (hasCaries)
              const Icon(Icons.warning, size: 14, color: Colors.red)
            else if (isRestored)
              const Icon(Icons.check, size: 14, color: Colors.blue)
            else
              const SizedBox(height: 14),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: const Text(
          'Ficha del Paciente',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: primaryColor,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Patient Header Card
            Container(
              padding: const EdgeInsets.all(20.0),
              color: Colors.white,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: secondaryColor,
                    child: Text(
                      name[0],
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: primaryColor),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Edad: $age años  |  Última visita: $lastVisit',
                          style: const TextStyle(color: textMuted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Odontogram Container
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                  side: const BorderSide(color: Color(0xFFE3E8ED)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.health_and_safety, color: primaryColor, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Odontograma Clínico (FDI)',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: primaryColor),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Upper Arch
                      const Text(
                        'ARCADA SUPERIOR (MAXILAR)',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textMuted),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 70,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: _upperTeeth.map((num) => _buildToothWidget(num)).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Lower Arch
                      const Text(
                        'ARCADA INFERIOR (MANDÍBULA)',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textMuted),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 70,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: _lowerTeeth.map((num) => _buildToothWidget(num)).toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

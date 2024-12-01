//import SessionData from "../models/SessionsModel.js";
//import SessionGroups from "../models/SessionsModel.js";

import models from "../models/SessionsModel.js"; // models ahora contiene { SessionGroups, SessionData }

const { SessionGroups, SessionData } = models;

/**
 * Endpoint para recibir los datos procesados y guardar la sesión en la base de datos
 * @module uploadSessionData
export const uploadSessionData = async (req, res) => {
  const { sessionName, sessionData } = req.body;

  try {
    console.log(sessionData);
    for (const data of sessionData) {
      await SessionData.create({
        sessionName,
        startTime: data.startTime,
        endTime: data.endTime,
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        duration: data.duration,
      });
    }
    res.status(200).json({ message: "Sesión guardada exitosamente." });
  } catch (error) {
    console.error("Error al guardar la sesión", error);
    res.status(500).json({ error: "Error al guardar la sesión." });
  }
};
*/

/**
 * Crea un nuevo grupo de sesión
 * @param {Request} req - Solicitud HTTP
 * @param {Response} res - Respuesta HTTP
 */
export const createSessionGroup = async (req, res) => {
  const { sessionName } = req.body;
  console.log(sessionName);
  try {
    const newGroup = await SessionGroups.create({ sessionName });
    console.log(newGroup);
    res.status(201).json({ sessionGroupId: newGroup.id });
  } catch (error) {
    console.error("Error al crear el grupo de sesión:", error);
    res.status(500).json({ error: "Error al crear el grupo de sesión." });
  }
};

/**
 * Guarda datos de sesión vinculados a un grupo
 * @param {Request} req - Solicitud HTTP
 * @param {Response} res - Respuesta HTTP
 */
export const uploadSessionData = async (req, res) => {
  const { sessionGroupId, sessionData } = req.body;
  console.log("HOLA");
  console.log(sessionData);

  try {
    for (const data of sessionData) {
      console.log(data);
      await SessionData.create({
        sessionGroupId,
        startTime: data.startTime,
        endTime: data.endTime,
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        duration: data.duration,
      });
    }
    res.status(201).json({ message: "Datos de sesión guardados exitosamente." });
  } catch (error) {
    console.error("Error al guardar los datos de sesión:", error);
    res.status(500).json({ error: "Error al guardar los datos de sesión." });
  }
};

/**
 * Obtiene estadísticas agrupadas por sesión.
 * @param {Request} req
 * @param {Response} res
 */
export const getSessionStats = async (req, res) => {
  try {
    const sessionGroups = await SessionGroups.findAll(); // Obtén todos los grupos de sesión

    const sessionStats = await Promise.all(
      sessionGroups.map(async (group) => {
        const sessionData = await SessionData.findAll({
          where: { sessionGroupId: group.id },
          order: [["startTime", "ASC"]], // Ordena por fecha de inicio
        });

        if (sessionData.length === 0) {
          // Si no hay datos, devuelve valores predeterminados
          return {
            sessionGroupId: group.id,
            sessionName: group.sessionName,
            timesPlayed: 0,
            firstStartTime: null,
            highestMaxScore: null,
            shortestDuration: null,
          };
        }

        // Procesa los datos de sesión
        const timesPlayed = sessionData.length;
        const firstStartTime = sessionData[0].startTime;
        const highestMaxScore = Math.max(...sessionData.map((d) => d.maxScore));

        // Convertir las duraciones
        const parsedDurations = sessionData.map((d) => parseDuration(d.duration));

        // Encontrar la duración más corta
        const shortestDuration = parsedDurations.reduce((min, curr) =>
          curr.valueInSeconds < min.valueInSeconds ? curr : min
        ).original;

        return {
          sessionGroupId: group.id,
          sessionName: group.sessionName,
          timesPlayed,
          firstStartTime,
          highestMaxScore,
          shortestDuration,
        };
      })
    );

    res.status(200).json(sessionStats);
  } catch (error) {
    console.error("Error al obtener estadísticas de sesión:", error);
    res.status(500).json({ error: "Error al obtener estadísticas de sesión." });
  }
};

const parseDuration = (durationString) => {
  const minutesMatch = durationString.match(/(\d+)\s*minuto/);
  const secondsMatch = durationString.match(/(\d+)\s*segundo/);

  let totalSeconds = 0;

  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1], 10) * 60; // Convertir minutos a segundos
  }

  if (secondsMatch) {
    totalSeconds += parseInt(secondsMatch[1], 10); // Sumar los segundos
  }

  return { valueInSeconds: totalSeconds, original: durationString };
};

/**
 * Endpoint para obtener datos detallados y estadísticas de un grupo de sesión
 */
export const getSessionGraphAndStats = async (req, res) => {
  const { sessionGroupId } = req.params;

  try {
      const sessionGroup = await SessionGroups.findByPk(sessionGroupId, {
          include: {
              model: SessionData,
              attributes: ['duration', 'totalScore', 'maxScore'], // Campos necesarios
          },
      });

      if (!sessionGroup) {
          return res.status(404).json({ error: 'Grupo de sesión no encontrado.' });
      }

      // Procesar las duraciones
      const durations = sessionGroup.session_data.map((data) => {
          const [value, unit] = data.duration.split(' ');
          return unit === 'segundos' ? parseInt(value, 10) / 60 : parseInt(value, 10); // Convertir segundos a minutos
      });

      const totalScores = sessionGroup.session_data.map((data) => data.totalScore);
      const maxScores = sessionGroup.session_data.map((data) => data.maxScore);

      // Calcular las estadísticas
      const totalDuration = durations.reduce((sum, dur) => sum + dur, 0); // Total en minutos
      const avgDuration = durations.length ? totalDuration / durations.length : 0;
      const longestDuration = Math.max(...durations);
      const shortestDuration = Math.min(...durations);
      const avgTotalScore = totalScores.length
          ? totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length
          : 0;
      const avgMaxScore = maxScores.length
          ? maxScores.reduce((sum, score) => sum + score, 0) / maxScores.length
          : 0;

      // Convertir duraciones más largas y más cortas a formato original
      const formatDuration = (duration) =>
          duration < 1 ? `${Math.round(duration * 60)} segundos` : `${Math.round(duration)} minutos`;

      res.json({
          sessionName: sessionGroup.sessionName,
          durations: sessionGroup.session_data.map((data) => data.duration),
          totalScores,
          statistics: {
              totalDuration: `${Math.round(totalDuration)} minutos`,
              avgDuration: `${avgDuration.toFixed(2)} minutos`,
              longestDuration: formatDuration(longestDuration),
              shortestDuration: formatDuration(shortestDuration),
              avgTotalScore: avgTotalScore.toFixed(2),
              avgMaxScore: avgMaxScore.toFixed(2),
          },
      });
  } catch (error) {
      console.error('Error al obtener datos y estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener datos y estadísticas.' });
  }
};

export const deleteSession = async (req, res) => {
  const { sessionGroupId } = req.params;  // Obtenemos el sessionGroupId desde los parámetros de la URL

  try {
    // Buscar la sesión con el sessionGroupId
    const session = await SessionGroups.findOne({ where: { id: sessionGroupId } });

    if (!session) {
      // Si no se encuentra la sesión, respondemos con un error 404
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    // Eliminar los datos de la sesión en session_data
    await SessionData.destroy({ where: { sessionGroupId } });

    // Ahora, eliminar la sesión en la tabla sessions
    await session.destroy();  // Eliminar la sesión de la base de datos

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Sesión y datos asociados eliminados con éxito' });

  } catch (error) {
    // Manejo de errores en caso de que algo falle
    console.error("Error al eliminar la sesión o los datos:", error);
    res.status(500).json({ error: 'Error al eliminar la sesión o los datos' });
  }
};




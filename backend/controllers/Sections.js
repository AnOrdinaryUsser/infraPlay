/**
 * @file Controller to handle frontend sections requests
 */
import Sections from "../models/SectionsModel.js";

/**
 * Module to get all sections by userName
 * @module getSections
 */
export const getSections = async (req, res) => {
    const { userName } = req.params; 

    try {
        const sections = await Sections.findAll({
            where: {
                userName: userName
            },
            attributes: ['id','name', 'rows', 'cols']
        });

        if (sections.length === 0) {
            return res.status(404).json({ msg: "No sections found for this user" });
        }

        res.json(sections);
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Module to get a section
 * @module getSection
 */
export const getSection = async (req, res) => {
    const { id } = req.params; // Assuming you're using a section ID to find a specific section
    try {
        const section = await Sections.findOne({ where: { id: id } });
        if (!section) {
            return res.status(404).json({ msg: "Section not found" });
        }
        res.json(section);
    } catch (error) {
        console.error("Error fetching section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Module to add a section
 * @module addSection
 */
export const addSection = async (req, res) => {
    const { sectionName, sectionRows, sectionCols, userName } = req.body;
    try {
        await Sections.create({
            name: sectionName,
            rows: sectionRows,
            cols: sectionCols,
            userName: userName
        });
        res.json({ msg: "Section Created" });
    } catch (error) {
        console.error("Error creating section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Module to modify a section
 * @module modifySection
 */
export const modifySection = async (req, res) => {
    const { id, name, rows, cols, userName } = req.body; // Assuming you're using a section ID to modify a specific section
    try {
        const section = await Sections.findOne({
            where: { id: id }
        });

        if (!section) {
            return res.status(404).json({ msg: "Section not found" });
        }

        await Sections.update({
            name: name,
            rows: rows,
            cols: cols,
            userName: userName
        }, {
            where: { id: id }
        });
        res.json({ msg: "Section modified" });
    } catch (error) {
        console.error("Error modifying section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Module to delete a section
 * @module deleteSection
 */
export const deleteSection = async (req, res) => {
    const { id } = req.params; // Assuming you're using a section ID to delete a specific section
    try {
        const rowsDeleted = await Sections.destroy({
            where: { id: id }
        });

        if (rowsDeleted === 0) {
            return res.status(404).json({ msg: "Section not found" });
        }

        res.json({ msg: "Section deleted" });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
